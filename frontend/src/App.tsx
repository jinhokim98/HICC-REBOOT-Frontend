import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import Admin from '@pages/Admin/Admin';
import Calendar from '@pages/Calendar';
import Home from '@pages/Home';
import ROUTE from '@constants/route';
import Temp from '@pages/temp/Temp';
import { Temp1, Temp2, Temp3 } from '@components/Temp';
import Approval from '@components/admin/Approval';
import MemberInfo from '@components/admin/MemberInfo';
import ChangeGrade from '@components/admin/ChangeGrade';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/admin" element={<Admin />}>
          <Route path="approval" element={<Approval />} />
          <Route path="info" element={<MemberInfo />} />
          <Route path="change" element={<ChangeGrade />} />
        </Route>
        <Route path={ROUTE.HOME} element={<Home />} />
        <Route path={ROUTE.CALENDAR} element={<Calendar />} />
        <Route path="/temp" element={<Temp />}>
          <Route path="apple" element={<Temp1 />} />
          <Route path="banana" element={<Temp2 />} />
          <Route path="mango" element={<Temp3 />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
