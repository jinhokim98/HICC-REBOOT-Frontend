import React from 'react';
import Nagne from '@assets/image/nagne.png';
import Today from '@assets/image/today.png';
import HiccJoon from '@assets/image/hiccjoon.png';
import HIAC from '@assets/image/hiac.png';
import * as P from './style/ProjectList.style';

const PROJECT_ITEMS = [
  {
    title: '나그네',
    content:
      '경로기반 여행sns 나그네입니다 관심있는 여행경로를 북마크해서 정보를 얻을 수 있고 팔로워들과 좋은 여행지롤 공유할 수 있는 sns입니다',
    person: '최세호 외 4명',
    date: '23.07.08',
    image: Nagne,
  },
  {
    title: '오늘뭐해',
    content:
      '"오늘뭐해" 는 HICC 내 식사, 스터디 등의 모임 매칭을 해주는 웹 서비스이다. 모집을 위해 모집글을 작성하면 부원들이 이를 보고 매칭신청을 할 수 있다. 인원이 다 찬 경우 대기열에 등록되어 남는 자리가 생기면 매칭되고 알림을 전송해 효율적인 모집이 가능하다.',
    person: '김규민 외 6명',
    date: '23.07.08',
    image: Today,
  },
  {
    title: '힉준',
    content: '프로그래밍 대회를 개최하기 위해 제작한 프로그래밍 대회 플랫폼 HICCjoon입니다.',
    person: '김진호 외 3명',
    date: '23.02.01',
    image: HiccJoon,
  },
  {
    title: 'HIAC',
    content: '동아리 회계관리 프로그램입니다. 카카오뱅크 거래내역을 엑셀로 입력하면 작동할 수 있습니다.',
    person: '김진호 외 4명',
    date: '22.08.07',
    image: HIAC,
  },
];

function ProjectList() {
  return (
    <P.Container>
      <P.GroupContainer>
        <P.Title>프로젝트 리스트업</P.Title>
        <P.Content>더 많은 정보를 얻고싶다면 HICC에 가입해보세요</P.Content>
        <P.ListContainer>
          {PROJECT_ITEMS.map((item, index) => (
            <P.ListBox key={index}>
              <P.Picture $image={item.image} />
              <P.ListBoxTitle>{item.title}</P.ListBoxTitle>
              <P.ListBoxContent>{item.content}</P.ListBoxContent>
              <P.ListBoxPar>
                <P.Person>{item.person}</P.Person>
              </P.ListBoxPar>
              <P.ListBoxDate>{item.date}</P.ListBoxDate>
            </P.ListBox>
          ))}
        </P.ListContainer>
      </P.GroupContainer>
    </P.Container>
  );
}

export default ProjectList;
