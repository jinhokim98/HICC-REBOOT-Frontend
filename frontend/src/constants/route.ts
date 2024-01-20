const ROUTE = Object.freeze({
  HOME: '/',
  CALENDAR: '/calendar',
  COMMUNITY: {
    BASE: '/community',
    LIST: '',
    WRITE: 'write',
    DETAIL: ':id',
  },
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN: '/admin',
});

export default ROUTE;
