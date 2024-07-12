import { createStore } from "redux";

const initialState = {
    user_data: "",
    favorites: ''
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case "userData":
            return { ...state, user_data: action.payload }
        case 'favorites':
            return { ...state, favorites: action.payload }
        default:
            return state
    }
}

const loadState = () => {
    try {
        const serializedState = localStorage.getItem("weather");
        if (!serializedState) return undefined;
        else return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("weather", serializedState);
    } catch (err) {
        console.log(err);
    }
};

const store = createStore(
    appReducer,
    loadState(),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true })
)

store.subscribe(() => {
    saveState(store.getState());
});

export default store;