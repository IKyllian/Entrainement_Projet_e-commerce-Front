export default function UserConnected(isConnected = true, action) {
    if(action.type === 'changeStatus') {
       // console.log('Reducer UserConnected', action);
        //Change UserConnected en true
        isConnected = action.isConnected;
        return isConnected
    } else if(action.type === 'logoutStatus') {
        //Change UserConnected en false
        isConnected = false;
        return isConnected;
    } else {
        return isConnected
    }
}