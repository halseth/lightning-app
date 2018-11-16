import { Store } from '../../../src/store';
import GrpcAction from '../../../src/action/grpc-mobile';
import * as logger from '../../../src/action/log';

describe('Action GRPC Mobile Unit Tests', () => {
  let store;
  let grpc;
  let sandbox;
  let LndReactModuleStub;
  let NativeEventEmitterStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    sandbox.stub(logger);
    store = new Store();
    LndReactModuleStub = {
      startUnlocker: sinon.stub(),
      closeUnlocker: sinon.stub(),
      start: sinon.stub(),
      close: sinon.stub(),
      sendCommand: sinon.stub(),
      sendStreamCommand: sinon.stub(),
      sendStreamWrite: sinon.stub(),
    };
    const NativeModulesStub = {
      LndReactModule: LndReactModuleStub,
    };
    NativeEventEmitterStub = function() {};
    NativeEventEmitterStub.prototype.addListener = sinon.stub();
    grpc = new GrpcAction(store, NativeModulesStub, NativeEventEmitterStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initUnlocker()', () => {
    it('should set unlockerReady', async () => {
      LndReactModuleStub.startUnlocker.resolves();
      await grpc.initUnlocker();
      expect(store.unlockerReady, 'to be', true);
    });
  });

  describe('closeUnlocker()', () => {
    it('should send ipc close call', async () => {
      LndReactModuleStub.closeUnlocker.resolves();
      await grpc.closeUnlocker();
      expect(LndReactModuleStub.closeUnlocker, 'was called once');
    });
  });

  describe('sendUnlockerCommand()', () => {
    it('should work for UnlockWallet', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('UnlockWallet')
      );
      await grpc.sendUnlockerCommand('UnlockWallet', {
        wallet_password: 'secret',
      });
      expect(
        LndReactModuleStub.sendCommand,
        'was called with',
        'UnlockWallet',
        'CgSx5yt6'
      );
    });

    it('should work for GenSeed', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('GenSeed')
      );
      await grpc.sendUnlockerCommand('GenSeed');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for InitWallet', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('InitWallet')
      );
      await grpc.sendUnlockerCommand('InitWallet');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for ChangePassword', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('ChangePassword')
      );
      await grpc.sendUnlockerCommand('ChangePassword');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });
  });

  describe('initLnd()', () => {
    it('should set lndReady', async () => {
      LndReactModuleStub.start.resolves();
      await grpc.initLnd();
      expect(store.lndReady, 'to be', true);
    });
  });

  describe('closeLnd()', () => {
    it('should send ipc close call', async () => {
      LndReactModuleStub.close.resolves();
      await grpc.closeLnd();
      expect(LndReactModuleStub.close, 'was called once');
    });
  });

  describe('restartLnd()', () => {
    it('should send ipc close and restart calls', async () => {
      LndReactModuleStub.close.resolves();
      await grpc.restartLnd();
      expect(LndReactModuleStub.close, 'was called once');
    });
  });

  describe('sendCommand()', () => {
    it('should work for GetInfo (without body)', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('GetInfo')
      );
      await grpc.sendCommand('GetInfo');
      expect(LndReactModuleStub.sendCommand, 'was called with', 'GetInfo', '');
    });

    it('should work for GetInfo (lowercase)', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('GetInfo')
      );
      await grpc.sendCommand('getInfo');
      expect(LndReactModuleStub.sendCommand, 'was called with', 'GetInfo', '');
    });

    it('should work for SendCoins (with body)', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('SendCoins')
      );
      await grpc.sendCommand('SendCoins', {
        addr: 'some-address',
        amount: 42,
      });
      expect(
        LndReactModuleStub.sendCommand,
        'was called with',
        'SendCoins',
        'Cgxzb21lLWFkZHJlc3MQKg=='
      );
    });

    it('should work for ListChannels', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('ListChannels')
      );
      await grpc.sendCommand('ListChannels');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for PendingChannels', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('PendingChannels')
      );
      await grpc.sendCommand('PendingChannels');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for ClosedChannels', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('ClosedChannels')
      );
      await grpc.sendCommand('ClosedChannels');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for ListPeers', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('ListPeers')
      );
      await grpc.sendCommand('ListPeers');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for ConnectPeer', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('ConnectPeer')
      );
      await grpc.sendCommand('ConnectPeer');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for AddInvoice', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('AddInvoice')
      );
      await grpc.sendCommand('AddInvoice');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for DecodePayReq', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('DecodePayReq')
      );
      await grpc.sendCommand('DecodePayReq');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for QueryRoutes', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('QueryRoutes')
      );
      await grpc.sendCommand('QueryRoutes');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for GetTransactions', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('GetTransactions')
      );
      await grpc.sendCommand('GetTransactions');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for ListInvoices', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('ListInvoices')
      );
      await grpc.sendCommand('ListInvoices');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for ListPayments', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('ListPayments')
      );
      await grpc.sendCommand('ListPayments');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for WalletBalance', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('WalletBalance')
      );
      await grpc.sendCommand('WalletBalance');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for ChannelBalance', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('ChannelBalance')
      );
      await grpc.sendCommand('ChannelBalance');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });

    it('should work for NewAddress', async () => {
      LndReactModuleStub.sendCommand.resolves(
        grpc._serializeResponse('NewAddress')
      );
      await grpc.sendCommand('NewAddress');
      expect(LndReactModuleStub.sendCommand, 'was called once');
    });
  });

  describe('sendStreamCommand()', () => {
    it('should work for OpenChannel (unidirectional stream)', done => {
      grpc._lndEvent.addListener.yieldsAsync(null, {
        streamId: '1',
        event: 'data',
        data: grpc._serializeResponse('OpenChannel'),
      });
      const stream = grpc.sendStreamCommand('OpenChannel', {
        node_pubkey: new Buffer('FFFF', 'hex'),
        local_funding_amount: 42,
      });
      expect(
        LndReactModuleStub.sendStreamCommand,
        'was called with',
        'OpenChannel',
        '1',
        'EgL//yAq'
      );
      stream.on('data', data => {
        expect(data, 'to be ok');
        done();
      });
    });

    it('should work for SendPayment (duplex stream parses json)', done => {
      grpc._lndEvent.addListener.yieldsAsync(null, {
        streamId: '1',
        event: 'data',
        data: grpc._serializeResponse('SendPayment'),
      });
      const stream = grpc.sendStreamCommand('SendPayment');
      expect(
        LndReactModuleStub.sendStreamCommand,
        'was called with',
        'SendPayment',
        '1',
        ''
      );
      stream.write(JSON.stringify({ payment_request: 'foo' }), 'utf8');
      expect(
        LndReactModuleStub.sendStreamWrite,
        'was called with',
        '1',
        'MgNmb28='
      );
      stream.on('data', data => {
        expect(data, 'to be ok');
        done();
      });
    });

    it('should work for CloseChannel', done => {
      grpc._lndEvent.addListener.yieldsAsync(null, {
        streamId: '1',
        event: 'data',
        data: grpc._serializeResponse('CloseChannel'),
      });
      const stream = grpc.sendStreamCommand('CloseChannel');
      expect(LndReactModuleStub.sendStreamCommand, 'was called once');
      stream.on('data', data => {
        expect(data, 'to be ok');
        done();
      });
    });

    it('should work for SubscribeTransactions', done => {
      grpc._lndEvent.addListener.yieldsAsync(null, {
        streamId: '1',
        event: 'data',
        data: grpc._serializeResponse('SubscribeTransactions'),
      });
      const stream = grpc.sendStreamCommand('SubscribeTransactions');
      expect(LndReactModuleStub.sendStreamCommand, 'was called once');
      stream.on('data', data => {
        expect(data, 'to be ok');
        done();
      });
    });

    it('should work for SubscribeInvoices', done => {
      grpc._lndEvent.addListener.yieldsAsync(null, {
        streamId: '1',
        event: 'data',
        data: grpc._serializeResponse('SubscribeInvoices'),
      });
      const stream = grpc.sendStreamCommand('SubscribeInvoices');
      expect(LndReactModuleStub.sendStreamCommand, 'was called once');
      stream.on('data', data => {
        expect(data, 'to be ok');
        done();
      });
    });

    it('should fail on stream error', done => {
      grpc._lndEvent.addListener.yieldsAsync(new Error('Boom!'));
      const stream = grpc.sendStreamCommand('SendPayment');
      stream.on('error', err => {
        expect(err.message, 'to equal', 'Boom!');
        done();
      });
    });
  });

  describe('_generateStreamId()', () => {
    it('should increment stream counter and generate a string', () => {
      expect(grpc._streamCounter, 'to equal', 0);
      expect(grpc._generateStreamId(), 'to equal', '1');
      expect(grpc._streamCounter, 'to equal', 1);
      expect(grpc._generateStreamId(), 'to equal', '2');
      expect(grpc._streamCounter, 'to equal', 2);
    });
  });
});
