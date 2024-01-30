/* eslint-disable no-use-before-define */
import React, { useEffect, useReducer, useState } from 'react';
import Arrow from '@assets/image/icon/arrow.svg';
import styled, { css } from 'styled-components';
import RadioGroup from '@components/common/radio/RadioGroup';
import RadioType from '@components/common/radio/RadioType';
import ExtensionModal from '@components/common/popup/confirm/ExtensionModal';
import confirm from '@components/common/popup/confirm/Confirm';
import usePatchChangeGrade from '@query/patch/usePatchChangeGrade';
import useDeleteMember from '@query/delete/useDeleteMember';
import * as I from './style/MemberInfo.style';
import * as A from './style/Approval.style';

interface UserData {
  department: string;
  name: string;
  grade: string;
  studentNumber: string;
}

interface MemberItemProps {
  userData: UserData;
}

export default function ChangeGradeMemberItem({ userData }: MemberItemProps) {
  const { updateGrade, isPending } = usePatchChangeGrade({ studentNumber: userData.studentNumber });
  const { deleteMember, isDeletePending } = useDeleteMember({ studentNumber: userData.studentNumber });
  const [collapsed, setCollapsed] = useState(false);
  const [option, setOption] = useState<RadioType | undefined>();
  const [modalOpen, setIsModalOpen] = useReducer((prev: boolean) => !prev, false);

  const options: RadioType[] = [
    {
      tag: '필수',
      disabled: false,
      label: '[회원]으로 등급 변경',
      value: 'NORMAL',
    },
    {
      tag: '필수',
      disabled: true,
      label: '[운영진]으로 등급 변경',
      value: 'EXECUTIVE',
    },
    {
      tag: '필수',
      disabled: false,
      label: '강제 탈퇴',
      value: '3',
      warning: '*강제 탈퇴 이후 회원 목록으로 복귀할 수 없습니다.',
    },
  ];

  if (userData.grade === 'NORMAL') {
    options[0].disabled = true;
    options[1].disabled = false;
  } else {
    options[0].disabled = false;
    options[1].disabled = true;
  }

  const popup = () => {
    confirm({
      content: `${userData.name} 님을 강제 탈퇴 시킵니다. [강제 탈퇴] 후 최소할 수 없습니다.`,
      okText: '강제 탈퇴',
      cancelText: '취소',
      isDangerous: true,
      onOk: () => deleteMember(),
      close: setIsModalOpen,
    });
  };

  const modalInfo = {
    close: setIsModalOpen,
    title: `[회원] ${userData.name} 님에 대한 회원 정보를 수정합니다.`,
    content: <RadioGroup options={options} currentOption={option} setCurrentOption={setOption} />,
    okText: '확인',
    cancelText: '취소',
    onOk: popup,
  };
  useEffect(() => {
    console.log('option : ', option);
  }, [option]);

  if (option?.value === '3') {
    modalInfo.onOk = popup;
  } else {
    modalInfo.onOk = () => {
      if (option?.value === 'NORMAL') {
        updateGrade({ grade: 'NORMAL' });
      } else {
        updateGrade({ grade: 'EXECUTIVE' });
      }
      setIsModalOpen();
    };
  }
  const clickEvent = () => {
    setCollapsed(!collapsed);
    // onClick();
    setIsModalOpen();
  };
  return (
    <>
      <A.MemberBox onClick={clickEvent}>
        <I.MemberInfoMajor>{userData.department}</I.MemberInfoMajor>
        <I.MemberInfoName>{userData.name}</I.MemberInfoName>
        <I.Blank>
          <ArrowImage src={Arrow} alt="arrow" $rotated={collapsed} />
        </I.Blank>
      </A.MemberBox>
      {modalOpen && <ExtensionModal {...modalInfo} />}
    </>
  );
}

interface ArrowImageProps {
  $rotated: boolean;
}
const ArrowImage = styled.img<ArrowImageProps>`
  width: 1.8rem;
  height: 1.8rem;
  flex-shrink: 0;
  transition: all ease 0.2s;
  ${(props) =>
    props.$rotated &&
    css`
      transform: rotate(180deg);
    `}
`;
