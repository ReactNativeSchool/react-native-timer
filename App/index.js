import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Picker,
  StatusBar
} from "react-native";

const screen = Dimensions.get("window");

const formatNumber = number => ("0" + number).slice(-2);

const getRemaining = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = length => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i++;
  }
  return arr;
};
const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

export default class App extends React.Component {
  state = {
    selectedMinutes: "0",
    selectedSeconds: "5",
    remainingSeconds: null,
    isRunning: false
  };

  interval = null;

  componentDidUpdate(prevProp, prevState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      return this.stop();
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState(state => ({
      remainingSeconds:
        parseInt(state.selectedMinutes) * 60 + parseInt(state.selectedSeconds),
      isRunning: true
    }));

    this.interval = setInterval(() => {
      this.setState(state => {
        return {
          remainingSeconds: state.remainingSeconds - 1
        };
      });
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;

    this.setState(state => ({
      isRunning: false
    }));
  };

  renderPickers = () => {
    const { selectedMinutes, selectedSeconds } = this.state;
    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMinutes}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={itemValue =>
            this.setState({ selectedMinutes: itemValue })
          }
        >
          {AVAILABLE_MINUTES.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>minutes</Text>
        <Picker
          selectedValue={selectedSeconds}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={itemValue =>
            this.setState({ selectedSeconds: itemValue })
          }
        >
          {AVAILABLE_SECONDS.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
      </View>
    );
  };

  render() {
    const {
      isRunning,
      remainingSeconds,
      selectedMinutes,
      selectedSeconds
    } = this.state;
    const { minutes, seconds } = getRemaining(remainingSeconds);

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {isRunning ? (
          <Text style={styles.timerText}>
            {minutes}:{seconds}
          </Text>
        ) : (
          this.renderPickers()
        )}
        {isRunning ? (
          <TouchableOpacity
            onPress={this.stop}
            style={[styles.button, styles.buttonPause]}
          >
            <Text style={[styles.buttonText, styles.buttonTextPause]}>
              Stop
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center"
  },
  timerText: {
    fontSize: 90,
    color: "#FFFFFF"
  },
  button: {
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderColor: "#89AAFF"
  },
  buttonPause: {
    borderColor: "#FF851B"
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF"
  },
  buttonTextPause: {
    color: "#FF851B"
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  picker: {
    width: 50
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20
  }
});
