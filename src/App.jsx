import React from 'react';
import { Routes, Route, useRoutes } from 'react-router-dom';
import { CustomProvider, Loader } from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import Frame from './components/Frame';
import DashboardPage from './pages/dashboard';
import Error404Page from './pages/authentication/404';
import Error403Page from './pages/authentication/403';
import Error500Page from './pages/authentication/500';
import Error503Page from './pages/authentication/503';

import SignInPage from './pages/authentication/sign-in';
import SignUpPage from './pages/authentication/sign-up';
import MembersPage from './pages/tables/members';
import VirtualizedTablePage from './pages/tables/virtualized';
import FormBasicPage from './pages/forms/basic';
import FormWizardPage from './pages/forms/wizard';

import { appNavs } from './config';
import { BrowserRouter } from 'react-router-dom';

//Calendar
import CalendarPage from './pages/calendar';

//Calleds
import Calleds from './pages/calleds/index.calleds';

//Register
import RegisterProducts from './pages/register/products/index.products';

//Finance
import FinanceCashiers from './pages/finance/cashiers/index.cashiers';
import FinanceBankAccounts from './pages/finance/bank-accounts/index.bank-accounts';
import FinancePayments from './pages/finance/payments/index.payments';
import FinanceReceivements from './pages/finance/receivements/index.receivements';
import FinanceStatements from './pages/finance/statements/index.statements';

//Settings
import Setting from './pages/setting/index.setting';
import SettingUsers from './pages/setting/index.setting.users';
import SettingRoles from './pages/setting/index.setting.roles';
import SettingBankAccounts from './pages/setting/index.setting.bank-accounts';
import SettingContabilityCategories from './pages/setting/index.setting.contability-categories';
import SettingPaymentMethods from './pages/setting/index.setting.payment-methods';

//Logistic
import LogisticCtes from './pages/logistic/ctes/index.ctes';
import LogisticShippiments from './pages/logistic/shippiments/index.shippiments'
import LogisticTrips from './pages/logistic/trips/index.trips'

//Integration
import Tasks from './pages/task/index.tasks'

//Integration
import Integrations from './pages/integration/index.integrations';

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
            <Route path="sign-up" element={<SignUpPage />} />

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

              {/*Integration*/}
              <Route path="integrations" element={<Integrations />} />

            </Route>
            
            <Route path="*" element={<Error404Page />} />

          </Routes>
        </CustomProvider>
      </IntlProvider>
    </>
  )
}

export default App;
