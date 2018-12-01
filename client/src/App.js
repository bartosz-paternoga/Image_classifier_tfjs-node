import React, { Component } from 'react';
import logo from './logo.svg';
import sound from './sound.mp3';
import './App.css';

import axios from 'axios';

class App extends Component {


componentDidMount() {
  this.Loader('');
   }


  state = {
     description: '',
     selectedFile: '',
     prediction:'',
        };


  previewFile = () =>{

  const preview = document.getElementById('uploadPreview');
  const file    = document.querySelector('input[type=file]').files[0];
  const reader  = new FileReader();

  reader.onload =  (e) => {
       preview.src= e.target.result;
      };

  if (file) {
    reader.readAsDataURL(file);
    }
  }




  Loader = (modelLoad) => {
    
   if (modelLoad ==="") {
       const elem1 = document.getElementById('loading-message');
       elem1.style.display = 'none';
       const elem2 = document.getElementById('sk-cube-grid');
       elem2.style.display = 'none';

    } else {
      const elem1 = document.getElementById('loading-message');
      elem1.style.display = '';
      const elem2 = document.getElementById('sk-cube-grid');
      elem2.style.display = '';
           }
     } 



    onChange = (e) => {
        switch (e.target.name) {
          case 'selectedFile':
            this.setState({ selectedFile: e.target.files[0] });
            this.setState({ prediction: '' });
            break;
          default:
            this.setState({ [e.target.name]: e.target.value });
            this.setState({ prediction: '' });
        }
      }


    onSubmit = (e) => {

        this.Loader('x');

        e.preventDefault();
        const { description, selectedFile } = this.state;
        let formData = new FormData();

        formData.append('description', description);
        formData.append('selectedFile', selectedFile);
        

        axios.post('/', formData)
          .then((result) => {

                document.getElementById('xyz').play();

                this.Loader('')

                let z = result.data;

                console.log("RE-post: ", z);
                console.log("POSTED!!!");
                console.log(this.state.selectedFile);

                this.setState({prediction: z.toString()});

                const text = "It's a " + z

                alert(text);

                document.getElementById("input").value = "";
                document.getElementById("uploadPreview").src = "";

          });

      }


    render() {

      return (
          <div>

            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h3> This app is using MobileNet model with tfjs-node to predict objects from an image</h3>
              </header>
            </div>
              <audio id="xyz" src={sound} preload="auto"></audio>
              <p id = "submit">Press choose file to upload an image or make <br/>a pic if on mobile phone. Then press submit.</p>
          
          <div onChange={this.previewFile}>
            <form id = "submit" onSubmit={this.onSubmit}>
            
              <input id = "input" 
                type="file"
                name="selectedFile"
                onChange={this.onChange}
              />
              <button id = "submitBtn" type="submit">Submit</button>
            </form>

            <form onSubmit={this.onSubmit1}> </form><br/>
          </div>

          <div id="loading-message">
            <p>This will take a few moments ...</p>
          </div>
      
          <div className="sk-cube-grid" id="sk-cube-grid">
            <div className="sk-cube sk-cube1"></div>
            <div className="sk-cube sk-cube2"></div>
            <div className="sk-cube sk-cube3"></div>
            <div className="sk-cube sk-cube4"></div>
            <div className="sk-cube sk-cube5"></div>
            <div className="sk-cube sk-cube6"></div>
            <div className="sk-cube sk-cube7"></div>
            <div className="sk-cube sk-cube8"></div>
            <div className="sk-cube sk-cube9"></div>
          </div><br/>

          <img src="" id="uploadPreview" width="200" height = "200" alt =""/>

          </div>
        );
      }
    }

export default App;
