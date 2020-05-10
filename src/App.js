import React from 'react';
import {ApolloProvider} from '@apollo/client';
import client from './apis/apolloClient';

//Components
import Header from './components/header/Header'
import MemeList from './components/memes/MemeList'

//Style
import './App.css';
import './components/Style.css'

function App() {
	return (
		<ApolloProvider client={client}>
			<Header/>
			<MemeList/>
		</ApolloProvider>
	);
}

export default App;