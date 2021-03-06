import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { InputField, AmountInputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, BackButton, PillButton } from '../component/button';
import Card from '../component/card';
import BitcoinIcon from '../asset/icon/bitcoin';
import { FormStretcher, FormText } from '../component/form';
import { BalanceLabel, BalanceLabelUnit } from '../component/label';
import { color } from '../component/style';

const styles = StyleSheet.create({
  description: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  balance: {
    marginBottom: 10,
  },
  unit: {
    color: color.blackText,
  },
  nextBtn: {
    marginTop: 20,
    backgroundColor: color.orange,
  },
});

const PayBitcoinView = ({ store, nav, payment }) => (
  <Background image="orange-gradient-bg">
    <Header shadow color={color.orange}>
      <BackButton onPress={() => nav.goPay()} />
      <Title title="On-Chain Payment">
        <BitcoinIcon height={13.6} width={10.8} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <MainContent>
      <Card>
        <FormText style={styles.description}>
          You are about to initiate an on-chain payment. It could take 10
          minutes or more to confirm.
        </FormText>
        <FormStretcher>
          <BalanceLabel style={styles.balance}>
            <AmountInputField
              autoFocus={true}
              value={store.payment.amount}
              onChangeText={amount => payment.setAmount({ amount })}
              onSubmitEditing={() => nav.goPayBitcoinConfirm()}
            />
            <BalanceLabelUnit style={styles.unit}>
              {store.unitFiatLabel}
            </BalanceLabelUnit>
          </BalanceLabel>
          <InputField
            placeholder="Bitcoin Address"
            value={store.payment.address}
            onChangeText={address => payment.setAddress({ address })}
            onSubmitEditing={() => nav.goPayBitcoinConfirm()}
          />
        </FormStretcher>
        <PillButton
          style={styles.nextBtn}
          onPress={() => nav.goPayBitcoinConfirm()}
        >
          Next
        </PillButton>
      </Card>
    </MainContent>
  </Background>
);

PayBitcoinView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PayBitcoinView);
