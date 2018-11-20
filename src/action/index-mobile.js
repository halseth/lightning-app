/**
 * @fileOverview this is the main action module for mobile where all actions
 * are initilized by injecting dependencies and then triggering startup actions
 * when certain flags on the global store are set to true.
 */

import { observe, when } from 'mobx';
import {
  Alert,
  Clipboard,
  AsyncStorage,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import { SecureStore, LocalAuthentication } from 'expo';
import { NavigationActions } from 'react-navigation';
import { nap } from '../helper';
import store from '../store';
import AppStorage from './app-storage';
import GrpcAction from './grpc-mobile';
import NavAction from './nav-mobile';
import WalletAction from './wallet';
import LogAction from './log';
import InfoAction from './info';
import NotificationAction from './notification';
import ChannelAction from './channel';
import TransactionAction from './transaction';
import PaymentAction from './payment';
import InvoiceAction from './invoice';
import SettingAction from './setting';
import AuthAction from './auth-mobile';

//
// Inject dependencies
//

store.init(); // initialize computed values

export const ipc = { send: () => {}, listen: () => {} };
export const db = new AppStorage(store, AsyncStorage);
export const log = new LogAction(store, ipc);
export const nav = new NavAction(store, NavigationActions);
export const grpc = new GrpcAction(store, NativeModules, NativeEventEmitter);
export const notify = new NotificationAction(store, nav);
export const wallet = new WalletAction(store, grpc, db, nav, notify);
export const info = new InfoAction(store, grpc, nav, notify);
export const transaction = new TransactionAction(store, grpc, nav, notify);
export const channel = new ChannelAction(store, grpc, nav, notify);
export const invoice = new InvoiceAction(store, grpc, nav, notify, Clipboard);
export const payment = new PaymentAction(store, grpc, nav, notify);
export const setting = new SettingAction(store, wallet, db, ipc);
export const auth = new AuthAction(
  store,
  wallet,
  nav,
  SecureStore,
  LocalAuthentication,
  Alert
);

//
// Init actions
//

db.restore(); // read user settings from disk

/**
 * Triggered after user settings are restored from disk and the
 * navigator is ready.
 */
when(
  () => store.loaded && store.navReady,
  async () => {
    await grpc.initUnlocker();
  }
);

/**
 * Triggered after the wallet unlocker grpc client is initialized.
 */
observe(store, 'unlockerReady', async () => {
  store.walletUnlocked = true;
  nav.goWait();
});

/**
 * Triggered after the user's password has unlocked the wallet
 * or a user's password has been successfully reset.
 */
observe(store, 'walletUnlocked', async () => {
  if (!store.walletUnlocked) return;
  await nap();
  await grpc.initLnd();
});

/**
 * Triggered once the main lnd grpc client is initialized. This is when
 * the user can really begin to interact with the application and calls
 * to and from lnd can be done. The display the current state of the
 * lnd node all balances, channels and transactions are fetched.
 */
observe(store, 'lndReady', () => {
  if (!store.lndReady) return;
  nav.goHome();
  info.getInfo();
});