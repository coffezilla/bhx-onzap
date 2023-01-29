// TYPE
export interface IRdxUser {
	isAuth: boolean;
	role: any;
	email: string;
	isWALogged: boolean;
}

interface IActLogin {
	type: 'LOGIN';
	payload: {
		role: any;
		email: string;
		isWALogged: boolean;
	};
}

interface IActLogout {
	type: 'LOGOUT';
}

type Action = IActLogin | IActLogout;

// CONSTRAIN
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

// ACTION
// login
export const rdxLoginUser = (role: any, email: any, isWALogged: false) => {
	return {
		type: LOGIN,
		payload: {
			role,
			email,
			isWALogged,
		},
	};
};

// logout
export const rdxLogoutUser = () => {
	return {
		type: LOGOUT,
	};
};

// REDUCERS
const INITIAL_STATE: IRdxUser = {
	isAuth: false,
	role: 'NONE',
	email: '',
	isWALogged: false,
};
const User = (state = INITIAL_STATE, action: Action) => {
	switch (action.type) {
		case LOGIN: {
			return { ...state, isAuth: true, role: action.payload.role, email: action.payload.email };
		}
		case LOGOUT: {
			return { ...state, isAuth: false, role: 'NONE' };
		}
		default:
			return state;
	}
};

export default User;
