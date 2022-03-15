import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/header';
import buildClient from '../api/build-client';

export const AppComponent = ({ Component, pageProps, currentUser }) =>{
    console.log(currentUser)
    return <div className="col-sm-12 col-md-12 col-lg-12">
                <Header currentUser={currentUser}></Header>
                <Component {...pageProps} ></Component>
            </div>
}

AppComponent.getInitialProps = async  appContext => {
    try {
        const client = buildClient(appContext.ctx);
        const { data: { currentUser }} = await client.get('/api/users/currentuser');
        console.log("current user", currentUser);
        return {
            currentUser
        };

    } catch (error) {
        console.log("hey", error)
        console.log("entreee")
        return {
            currentUser: null
        };
    }
}


export default AppComponent;