import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { openLink } from '../services/link.service';

export default class ReposScreen extends React.Component {
    state = {
        isLoading: true,
        repos: []
    };

    componentDidMount() {
        return fetch(
            'https://api.github.com/search/repositories?q=language:javascript stars:>10000&sort=stars&order=desc'
        )
            .then(response => response.json())
            .then(responseJson => {
                this.setState(
                    {
                        isLoading: false,
                        repos: responseJson.items
                    },
                    function() {}
                );
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.repos}
                    keyExtractor={item => item.node_id}
                    renderItem={({ item: repo }) => <Repo repo={repo} />}
                />
            </View>
        );
    }
}

class Repo extends React.Component {
    render() {
        const { repo } = this.props;

        return (
            <View style={styles.repo}>
                <TouchableOpacity onPress={this.handlePress}>
                    <Text style={styles.name}>{repo.name}</Text>
                </TouchableOpacity>
                <Text>{repo.description}</Text>
                <Text style={styles.stats}>
                    {repo.language}, {repo.forks} forks, {repo.stargazers_count}{' '}
                    stars
                </Text>
            </View>
        );
    }

    handlePress = () => {
        const { repo } = this.props;

        openLink(repo.html_url)
            .then(() => {
                __DEV__ ? console.log('Repo opened successfully') : null;
            })
            .catch(() => {
                __DEV__ ? console.log('Could not open repo') : null;
            });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    repo: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0366d6',
        marginBottom: 16
    },
    stats: {
        fontStyle: 'italic',
        marginTop: 8
    }
});
