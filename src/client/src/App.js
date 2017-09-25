import React, {Component} from 'react';
import {FontIcon, Paper} from 'material-ui';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import styles from './index.css';


console.log(styles)
class App extends Component {
  state = {
    selectedIndex: 0
  };

  select = (index) => this.setState({selectedIndex: index});

  render() {
    return (
      <Paper zDepth={1} className={styles['bottom-nav']}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="首页"
            icon={<FontIcon className="material-icons">restore</FontIcon>}
            onClick={() => this.select(0)}/>
          <BottomNavigationItem
            label="市场"
            icon={<FontIcon className="material-icons">favorite</FontIcon>}
            onClick={() => this.select(1)}/>
          <BottomNavigationItem
            label="我"
            icon={<IconLocationOn/>}
            onClick={() => this.select(2)}/>
        </BottomNavigation>
      </Paper>
    );
  }
}

export default App;
