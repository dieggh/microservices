import 'bootstrap/dist/css/bootstrap.css';
import { fetchAux } from '../helpers/fetchAux';
import Header from '../components/header';

export const AppComponent = ({ Component, pageProps, currentUser }) =>{
    console.log(currentUser)
    return <div className="col-sm-12 col-md-12 col-lg-12">
                <Header currentUser={currentUser}></Header>
                <Component {...pageProps} ></Component>
            </div>
}

AppComponent.getInitialProps = async  appContext => {
    try {
        
        
        const resp = await fetchAux('/users/currentuser', null, 'GET', appContext.ctx);

        //console.log(await resp.text())
        const { currentUser } = await resp.json();

        return {
            currentUser
        };
        
    } catch (error) {
        console.log(error)
        console.log("entreee")
        return {
            currentUser: null
        };
    }
}


export default AppComponent;