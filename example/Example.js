'use strict';

import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Slider,
  Image,
  Platform,
} from 'react-native';

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker from './CustomMarker';

class Example extends React.Component {
  state = {
    sliderOneChanging: false,
    sliderOneValue: [5],
    multiSliderValue: [3, 7],
  };

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true,
    });
  }

  sliderOneValuesChange = (values) => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderOneValue: newValues,
    });
  }

  sliderOneValuesChangeFinish = () => {
    this.setState({
      sliderOneChanging: false,
    });
  }

  multiSliderValuesChange = (values) => {
    this.setState({
      multiSliderValue: values,
    });
  }

  onMarkerOneMoveStart = (markerOne) => {
    markerOne.measure((fx, fy, width, height, px, py) => {
      this.setState({
        position: {
          x: px,
          y: py,
          height: height,
          diff: 0
        }
      });
    });
  }

  lastPos = null;
  onMarkerOneMoved = (position) => {
    if (!this.lastPos) {
      this.lastPos = position;
    }

    this.setState({
      position: {
        ...this.state.position,
        diff: (position - this.lastPos)
      }
    })
  }

  onMarkerOneMoveEnd = (markerOne) => {
    this.lastPos = null;
    markerOne.measure((fx, fy, width, height, px, py) => {
      this.setState({
        position: {
          x: px,
          y: py,
          height: height,
          diff: 0
        }
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sliders</Text>
        <View style={styles.sliders}>
          <View style={styles.sliderOne}>
            <Text style={styles.text}>One Marker with callback example:</Text>
            <Text style={[styles.text, this.state.sliderOneChanging && {color: 'red' }]}>{this.state.sliderOneValue}</Text>
          </View>
          <MultiSlider
            values={this.state.sliderOneValue}
            sliderLength={280}
            onValuesChangeStart={this.sliderOneValuesChangeStart}
            onValuesChange={this.sliderOneValuesChange}
            onValuesChangeFinish={this.sliderOneValuesChangeFinish}
            onMarkerOneMoveStart={this.onMarkerOneMoveStart}
            onMarkerOneMoved={this.onMarkerOneMoved}
            onMarkerOneMoveEnd={this.onMarkerOneMoveEnd}
          />
          <View style={styles.sliderOne}>
            <Text style={styles.text}>Two Markers:</Text>
            <Text style={styles.text}>{this.state.multiSliderValue[0]} </Text>
            <Text style={styles.text}>{this.state.multiSliderValue[1]}</Text>
          </View>
          <MultiSlider
            values={[this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
            sliderLength={280}
            onValuesChange={this.multiSliderValuesChange}
            onMarkerOneMoved={this.onMarkerOneMoved}
            onMarkerTwoMoved={this.onMarkerTwoMoved}
            min={0}
            max={10}
            step={1}
            allowOverlap
            snapped
          />
        </View>
        <Text style={styles.text}>Native RCT Slider</Text>
        <Slider style={{width: 280,}}/>
        <Text style={styles.text}>Custom Marker</Text>
        <MultiSlider
          selectedStyle={{
            backgroundColor: 'gold',
          }}
          unselectedStyle={{
            backgroundColor: 'silver',
          }}
          values={[5]}
          containerStyle={{
            height:40,
          }}
          trackStyle={{
            height:10,
            backgroundColor: 'red',
          }}
          touchDimensions={{
            height: 40,
            width: 40,
            borderRadius: 20,
            slipDisplacement: 40,
          }}
          customMarker={CustomMarker}
          sliderLength={280}
        />
        {
          this.state.sliderOneChanging && this.state.position ?
            <Image style={{position: "absolute",
              width: 74,
              height: 40,
              left: this.state.position.x - 74 / 2 + 24 + this.state.position.diff,
              top: (this.state.position.y + this.state.position.height / 2) - 40 / 2 - 24,
            }}source={require("./tooltip.png")}/> : null
        }
      </View>
    );
  }
}

export default Example;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliders: {
    margin: 20,
    width: 280,
  },
  text: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 30,
  },
  sliderOne: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});
