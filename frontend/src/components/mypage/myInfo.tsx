import React, { useEffect, useState } from 'react';
import OptionType from '@components/common/dropdown/OptionType';
import Dropdown from '@components/mypage/Dropdown';
import useDropdown from '@hooks/useDropdown';
import useInput from '@hooks/useInput';
import withdrawal, { WithdrawalParameter } from '@components/common/popup/withdrawal/withdrawal';
import * as M from './style/myInfo.style';

function MyInfo() {
  const options: OptionType[] = [
    { value: '1', label: '기초과학과' },
    { value: '2', label: '건설환경공학과' },
    { value: '3', label: '전자전기공학부' },
    { value: '4', label: '컴퓨터공학부' },
    { value: '5', label: '산업·데이터공학과' },
    { value: '6', label: '신소재화공시스템공학부' },
    { value: '7', label: '기계·시스템디자인공학부' },
    { value: '8', label: '건축학부' },
    { value: '9', label: '도시공학과' },
    { value: '10', label: '경영학부' },
    { value: '11', label: '영어영문학과' },
    { value: '12', label: '독어독문학과' },
    { value: '13', label: '독어독문학과' },
    { value: '14', label: '불어불문학과' },
    { value: '15', label: '국어국문학과' },
    { value: '16', label: '법학부' },
    { value: '17', label: '수학교육과' },
    { value: '18', label: '국어교육과' },
    { value: '19', label: '영어교육과' },
    { value: '20', label: '역사교육과' },
    { value: '21', label: '교육학과' },
    { value: '22', label: '동양화과' },
    { value: '23', label: '회화과' },
    { value: '24', label: '판화과' },
    { value: '25', label: '조소과' },
    { value: '26', label: '목조형가구학과' },
    { value: '27', label: '예술학과' },
    { value: '28', label: '금속조형디자인과' },
    { value: '29', label: '도예유리과' },
    { value: '30', label: '섬유미술패션디자인과' },
    { value: '31', label: '자율전공' },
    { value: '32', label: '디자인학부' },
    { value: '33', label: '경제학부' },
    { value: '34', label: '공연예술학부' },
    { value: '35', label: '디자인경영융합학부' },
    { value: '36', label: '캠퍼스자율전공(서울)' },
    { value: '37', label: '교양교육원' },
  ];

  const { currentOption, onChange } = useDropdown({});
  const { 0: phoneNumber, 1: phoneNChange } = useInput('');
  const { 0: email, 1: scholNChange } = useInput('');
  const [buttonState, setButton] = useState(true);
  const [numberState, setNumberState] = useState(true);
  const [emailState, setEmailState] = useState(true);
  const [majorState, setMajorState] = useState(true);

  const handleWithdrawal = () => {
    const withdrawalConfirmParams: WithdrawalParameter = {
      title: '탈퇴하시겠습니까?',
      content: '회원 정보가 모두 삭제되며, 기존에 작성한 글은 유지됩니다',
      okText: '탈퇴',
      cancelText: '취소',
      isDangerous: true,
      onOk: () => {
        // Perform the withdrawal action here
        console.log('Withdrawal confirmed');
      },
      // onCancel: () => {
      //   // Handle cancellation
      //   console.log('Withdrawal canceled');
      // },
    };

    withdrawal(withdrawalConfirmParams);
  };

  useEffect(() => {
    const phoneRE = /^010-\d{4}-\d{4}$/;
    const emailRE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (phoneRE.test(phoneNumber)) {
      setNumberState(false);
    } else {
      setNumberState(true);
    }
    if (currentOption !== null) {
      setMajorState(false);
    } else {
      setMajorState(true);
    }
    if (emailRE.test(email)) {
      setEmailState(false);
    } else {
      setEmailState(true);
    }
  }, [phoneNumber, email, currentOption]);

  useEffect(() => {
    if (numberState === false && majorState === false && emailState === false) {
      setButton(false);
    } else {
      setButton(true);
    }
  }, [numberState, majorState, emailState]);

  const handleSubmit = () => {
    const submitParam = {
      phoneNumber: { phoneNumber },
      schoolNumber: { schoolNumber: email },
      major: { currentOption },
    };
    console.log(submitParam);
  };

  const formatPhoneNumber = (input: string) => {
    // 숫자 이외에 전부 삭제
    const numericInput = input.replace(/\D/g, '');
    // 형식 만족시 전화번호 형식으로 변경
    const formattedNumber = numericInput.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

    return formattedNumber;
  };

  const handlePhoneInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(event.target.value);
    phoneNChange(formattedNumber);
  };

  return (
    <M.Container>
      <M.GroupContainer>
        <M.Title>
          <M.Name>홍길동</M.Name>
          <M.Label>운영진</M.Label>
        </M.Title>
        <M.BoxArea style={{ left: '0rem', top: '7.7rem' }}>
          <M.BoxTitle>전화번호</M.BoxTitle>
          <M.Input onChange={handlePhoneInputChange} value={phoneNumber}></M.Input>
          {numberState === true && <M.BoxAlert>올바른 형식으로 기입해주세요</M.BoxAlert>}
        </M.BoxArea>
        <M.BoxArea style={{ right: '0rem', top: '7.7rem' }}>
          <M.BoxTitle>이메일</M.BoxTitle>
          <M.Input onChange={scholNChange}></M.Input>
          {emailState === true && <M.BoxAlert>올바른 형식으로 기입해주세요</M.BoxAlert>}
        </M.BoxArea>
        <M.BigBoxArea>
          <M.BoxTitle>학과</M.BoxTitle>
          <Dropdown placeholder="전공" options={options} onChange={onChange} />
          {majorState === true && <M.BoxAlert>전공을 선택해주세요</M.BoxAlert>}
        </M.BigBoxArea>
        <M.Button onClick={handleSubmit} disabled={buttonState}>
          프로필 수정
        </M.Button>
      </M.GroupContainer>
      <M.ExitArea>
        <M.ExitContent onClick={handleWithdrawal}>회원 탈퇴</M.ExitContent>
      </M.ExitArea>
      <M.BottomDiv />
    </M.Container>
  );
}

export default MyInfo;
