import React from 'react';
import { Routes, Route, useRoutes } from 'react-router-dom';
import { CustomProvider, Loader } from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import Frame from './components/Frame';
import DashboardPage from './views/dashboard';
import Error404Page from './views/errors/404';

import SignInPage from './views/sign-in';

import { appNavs } from './config';
import { BrowserRouter } from 'react-router-dom';

//Calendar
import CalendarPage from './views/calendar';

//Calleds
import Calleds from './views/calleds/index.calleds';

//Register
import RegisterProducts from './views/register/products/index.products';

//Finance
import FinanceCashiers from './views/finance/cashiers/index.cashiers';
import FinanceBankAccounts from './views/finance/bank-accounts/index.bank-accounts';
import FinancePayments from './views/finance/payments/index.payments';
import FinanceReceivements from './views/finance/receivements/index.receivements';
import FinanceStatements from './views/finance/statements/index.statements';

//Settings
import Setting from './views/setting/index.setting';
import SettingUsers from './views/setting/index.setting.users';
import SettingRoles from './views/setting/index.setting.roles';
import SettingBankAccounts from './views/setting/index.setting.bank-accounts';
import SettingContabilityCategories from './views/setting/index.setting.contability-categories';
import SettingPaymentMethods from './views/setting/index.setting.payment-methods';

//Logistic
import LogisticCtes from './views/logistic/ctes/index.ctes';
import LogisticShippiments from './views/logistic/shippiments/index.shippiments'
import LogisticTrips from './views/logistic/trips/index.trips'

//Integration
import Tasks from './views/task/index.tasks'

import ptBR from 'rsuite/locales/pt_BR';
import { IntlProvider } from 'react-intl';

export class Loading extends React.Component {

  static Show(message = 'Carregando...') {
    document.getElementById('loading').style.display = 'block'
  }

  static Hide() {
    document.getElementById('loading').style.display = 'none';
  }

  render() {
    return (
      <div id='loading' className="loader-overlay" style={{display: 'none'}}>
        <div className="loader-content loader-center">
          <div className="loader-center"><Loader size="lg" inverse content='Carregando...' /></div>
        </div>
      </div>
    );
  }

}

const App = () => {

  return (
    <>
      <Loading />
      <IntlProvider locale="zh">
        <CustomProvider locale={ptBR}>
          <Routes>
            
            <Route path="sign-in" element={<SignInPage />} />

            <Route path="/" element={<Frame navs={appNavs} />}>

              <Route index element={<DashboardPage />} />

              <Route path="dashboard" element={<DashboardPage />} />

              {/*Calendar*/}
              <Route path='calendar' element={<CalendarPage />} />

              {/*Calleds*/}
              <Route path='calleds' element={<Calleds />} />

              {/*Register*/}
              <Route path="register/products" element={<RegisterProducts />} />

              {/*Finance*/}
              <Route path="finance/cashiers" element={<FinanceCashiers />} />
              <Route path="finance/bank-accounts" element={<FinanceBankAccounts />} />
              <Route path="finance/payments" element={<FinancePayments />} />
              <Route path="finance/receivements" element={<FinanceReceivements />} />
              <Route path="finance/statements" element={<FinanceStatements />} />

              {/*Logistic*/}
              <Route path="logistic/ctes" element={<LogisticCtes />} />
              <Route path="logistic/shippiments" element={<LogisticShippiments />} />
              <Route path="logistic/trips" element={<LogisticTrips />} />

              {/*Setting*/}
              <Route path="setting" element={<Setting />} />
              <Route path="setting/users" element={<SettingUsers />} />
              <Route path="setting/roles" element={<SettingRoles />} />
              <Route path="setting/bank-accounts" element={<SettingBankAccounts />} />
              <Route path="setting/contability-categories" element={<SettingContabilityCategories />} />
              <Route path="setting/payment-methods" element={<SettingPaymentMethods />} />

              {/*Task*/}
              <Route path="tasks" element={<Tasks />} />

            </Route>
            
            <Route path="*" element={<Error404Page />} />

          </Routes>
        </CustomProvider>
      </IntlProvider>
    </>
  )
}

export default App;
