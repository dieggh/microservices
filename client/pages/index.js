import buildClient from '../api/build-client';

export const LandingPage = ( { currentUser } ) => {
    console.log(currentUser)
    return currentUser ? (
        <h1> you are sign in </h1> ) : (
            <h1>You are not sign in</h1>
        )
}

export async function getServerSideProps( context ) {

    try {
        const client = buildClient(context);
        const { data: currentUser } = await client.get('/api/users/currentuser');
        console.log(currentUser)
        return {
            props: { currentUser }, // will be passed to the page component as props
        }
    } catch (error) {
        console.log("entreee al error", error)
        return {
            props: { currentUser: null }, // will be passed to the page component as props
        }
    }
}

export default LandingPage;