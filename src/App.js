import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceDetection from './Components/FaceDetection/FaceDetection';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import './App.css';

const app = new Clarifai.App({
  apiKey: '6a253cf2b87f4d2bb6386e0dd0e38baf'
});


const particlesOptions = {
  particles : {
    number : {
      value : 30,
      density : {
        enable : true,
        value_area : 1000
      }
    }
  }
}
class App extends Component {
  constructor () {
    super ();
    this.state = {
      input : '',
      imageUrl : '',
      box : {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol : clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol : width - (clarifaiFace.right_col * width),
      bottomRow : height - (clarifaiFace.bottom_row * height)
    }
  }
  
  displayFaceBox  = (box) => {
    console.log(box);
    this.setState({box : box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl : this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }
  render() {
    return (
        <div className = "App">
          <Logo />
          <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = {this.onButtonSubmit} />
          <FaceDetection box={this.state.box} imageUrl = {this.state.imageUrl}/>
          <Particles claasName = 'particles' params={particlesOptions}/>
        </div>
    );
  }
    
}

export default App;
