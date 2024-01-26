import { QUERY_KEYS } from '@constants/keys';
import { useSuspenseQuery } from '@tanstack/react-query';
import request from '@utils/request';

interface PresidentInfo {
  name: string;
  phone_number: string;
}

function useGetFooterInfo() {
  const fetchPresidentName = async () => {
    const response = await request<null, PresidentInfo, null>({
      uri: '/api/footer-info',
      method: 'get',
    });

    return response.data;
  };

  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.GET_PRESIDENT_INFO],
    queryFn: fetchPresidentName,
  });

  return { data };
}

export default useGetFooterInfo;