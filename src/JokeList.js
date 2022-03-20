import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";


class JokeList extends React.Component {
  static defaultProps = {
    numJokesToGet: 10
  };
  constructor(props) {
    super(props)
    this.state ={
      jokes: [],
    }
    this.vote = this.vote.bind(this);
    this.getJokes = this.getJokes.bind(this);
    
  }
    async getJokes() {
      let jokes = this.state.jokes;
      let votes = JSON.parse(window.localStorage.getItem('votes') || '{}');

    let seenJokes = new Set(this.state.jokes.map(({id}) => id));
      try {
        while (jokes.length < this.props.numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { status, ...jokeObj } = res.data;
  
          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            votes[jokeObj.id] = votes[jokeObj.id] || 0;
            jokes.push({ ...jokeObj, votes: votes[jokeObj.id] });
          } else {
            console.error("duplicate found!");
          }  
        }
        this.setState({ jokes:jokes});
        window.localStorage.setItem('votes', JSON.stringify(votes));
      } catch(e) {
        console.log(e);
      }
    }


    vote(jokeId, value) {
      let votes = JSON.parse(window.localStorage.getItem('votes'));
      votes[jokeId] = votes[jokeId] ? votes[jokeId] + value : value;
      window.localStorage.setItem('votes', JSON.stringify(votes));
      this.setState(state => ({
        jokes: state.jokes.map(j => (jokeId === j.id) ? { ...j, votes: j.votes + value } : j )
        
      }));
    }

    render() {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

      return (
        <div className ="JokeList">
          <button className ="JokeList-getmore" onClick={this.getJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }
}


export default JokeList;
