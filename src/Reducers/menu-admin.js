const initialState = {
    collapsed: false,
}
export default function MenuAdmin(state = initialState, action) {
    switch(action.type) {
        case 'onCollapse' : {
            return {
                ...state,
                    collapsed: !state.collapsed
            }
        }
        default : 
            return state;
    }
}