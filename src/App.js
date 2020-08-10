import React, { Component } from 'react';
import Gif from './components/Gif'
import loader from './images/loader.svg'
import close from './images/close-icon.svg'


const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Userhint = ({loading, hintText}) => (
  <div className = "user-hint">
    {loading ?  <img className="block mx-auto" src={loader}/> : hintText}
  </div>
);

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults ?
      <button onClick={clearSearch}><img className="block mx-auto" src={close}/></button> :
      <h1 className="title">Jiffy - your gif generator</h1>
    }
  </div>
);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '', 
      hintText: 'Pandas are black and white you know! Also type panda in the search box, dummy',
      gifs:[],
    };
  }

  searchGiphy = async searchTerm => {
    this.setState({
      loading: true,
      false: true, 
    })
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=RlCDMjMRvPYOz3JJYM5TJTRS2aZle6gK&q=${searchTerm}&limit=25&offset=0&rating=g&lang=en`);
      // converting response into json data
      // grabbing the first key that is called data ==> essentially i am writing data = response.json().data
      const {data} = await response.json();

      if (!data.length) {
        throw  `Nothing found for ${searchTerm}`
      }

      const randomGif = randomChoice(data)

      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: 'ENTER to see more',
      }))
    } catch(error) {
      this.setState((prevState, props) => ({
        ...prevState, 
        hintText: error, 
        loading: false,
      }))
    }
  }

  handleChange = (event) => {
    const {value} = event.target;
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `hit enter to see MORE of ${value}` : 'Pandas are black and white you know! Also type panda in the search box, dummy',
    }))
  }

  handleKeyPress = (event) => {
    const {value} = event.target;
    const {key} = event;
    if (key === "Enter" && value.length > 2) {
      this.searchGiphy(value);
    } 
  }

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState, 
      searchTerm: '', 
      hintText: 'Pandas are black and white you know! Also type panda in the search box, dummy', 
      gifs: [],
    }))
    this.textInput.focus();
  }
  render() {
    const { searchTerm, gifs } = this.state;
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults}/>
        <div className="search grid">
          <input 
            className="input grid-item" 
            placeholder="Type something here"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {this.textInput = input}}/>      
          {gifs.map((gif, i) => <Gif key={i} {...gif}/>)}

        </div>
        <Userhint {...this.state}/>
      </div>
    );
  }
}

export default App;
