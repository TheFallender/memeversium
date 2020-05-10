import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  	cache: new InMemoryCache(),
  	link: new HttpLink({
		uri: 'https://thefallenstudio.dnset.com:4000/',
	}),
	onError: ({ networkError, graphQLErrors }) => {
		console.log('graphQLErrors', graphQLErrors)
		console.log('networkError', networkError)
	}
});

export default client;