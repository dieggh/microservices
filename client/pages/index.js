import { fetchAux } from "../helpers/fetchAux";

export const LandingPage = ( { currentUser } ) => {
    console.log(currentUser)
    
    return currentUser ? (
        <h1> you are sign in </h1> ) : (
            <h1>You are not sign in</h1>
        ) 
}

export async function getServerSideProps( context ) {

    try {
        
        const resp = await fetchAux('/users/currentuser', null, 'GET', context);

        //console.log(await resp.text())
        const { currentUser } = await resp.json();
        console.log(currentUser)
        return {
            props: {currentUser }, // will be passed to the page component as props
        }
    } catch (error) {
        console.log("entreee")
        return {
            props: {currentUser: null }, // will be passed to the page component as props
        }
    }
}

export default LandingPage;