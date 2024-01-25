// import React, {Component} from 'react';
// import {View, Text, Dimensions} from 'react-native';
// import FlipCard from 'react-native-flip-card';

// export default class MyLayout extends Component {
//   render() {
// const {width, height} = Dimensions.get('window');
// const cardSize = width / 3 - 10; // Assuming 3 cards per row with some margin

// const cards = [
//   {front: 'Card 1 ', back: 'Card 1 details', color: '#FFA07A'},
//   {front: 'Card 2 ', back: 'Card 2 details', color: '#7FFFD4'},
//   {front: 'Card 3 ', back: 'Card 3 details', color: '#DDA0DD'},
//   {front: 'Card 4 ', back: 'Card 4 details', color: '#FFD700'},
//   {front: 'Card 5 ', back: 'Card 5 details', color: '#90EE90'},
//   {front: 'Card 6 ', back: 'Card 6 details', color: '#87CEFA'},
//   {front: 'Card 7 ', back: 'Card 7 details', color: '#FFA07A'},
//   {front: 'Card 8 content', back: 'Card 8 details', color: '#7FFFD4'},
//   {front: 'Card 9 content', back: 'Card 9 details', color: '#DDA0DD'},
// ];

//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'space-around',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//           flexDirection: 'row',
//           paddingTop: 15, // Optional, for some padding at the top
//         }}>
//         {cards.map((card, index) => (
//           <View
//             key={index}
//             style={{
//               width: cardSize,
//               height: cardSize,
//               margin: 5,
//               backgroundColor: card.color,
//               justifyContent: 'center',
//               alignItems: 'center',
//               borderRadius: 10,
//             }}>
//             <Text>{card.front}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   }
// }

import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import FlipCard from 'react-native-flip-card';

export default class MyLayout extends Component {
  render() {
    const {width} = Dimensions.get('window');
    const cardSize = width / 3 - 10; // Assuming 3 cards per row with some margin

    const card1 = {
      front: 'Card 1 content',
      back: 'Card 1 details',
      color: '#FFA07A',
    };
    const card2 = {
      front: 'Card 2 content',
      back: 'Card 2 details',
      color: '#7FFFD4',
    };
    const card3 = {
      front: 'Card 3 content',
      back: 'Card 3 details',
      color: '#6495ED',
    };
    const card4 = {
      front: 'Card 4 content',
      back: 'Card 4 details',
      color: '#DC143C',
    };

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          flexDirection: 'row',
          paddingTop: 20,
        }}>
        {/* First Card */}
        <FlipCard
          style={{width: cardSize, height: cardSize, margin: 5}}
          flipHorizontal
          flipVertical={false}>
          <View
            style={{
              width: cardSize,
              height: cardSize,
              backgroundColor: card1.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{card1.front}</Text>
          </View>
          <View
            style={{
              width: cardSize,
              height: cardSize,
              backgroundColor: card1.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{card1.back}</Text>
          </View>
        </FlipCard>

        {/* Second Card */}
        <FlipCard
          style={{width: cardSize, height: cardSize, margin: 5}}
          flipHorizontal
          flipVertical={false}>
          <View
            style={{
              width: cardSize,
              height: cardSize,
              backgroundColor: card2.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{card2.front}</Text>
          </View>
          <View
            style={{
              width: cardSize,
              height: cardSize,
              backgroundColor: card2.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{card2.back}</Text>
          </View>
        </FlipCard>

        {/* Third Card */}
        <FlipCard
          style={{width: cardSize, height: cardSize, margin: 5}}
          flipHorizontal
          flipVertical={false}>
          <View
            style={{
              width: cardSize,
              height: cardSize,
              backgroundColor: card3.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{card3.front}</Text>
          </View>
          <View
            style={{
              width: cardSize,
              height: cardSize,
              backgroundColor: card3.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{card3.back}</Text>
          </View>
        </FlipCard>

        {/* Fourth Card */}
        <FlipCard
          style={{width: cardSize, height: cardSize, margin: 5}}
          flipHorizontal
          flipVertical={false}>
          <View
            style={{
              width: cardSize,
              height: cardSize,
              backgroundColor: card4.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{card4.front}</Text>
          </View>
          <View
            style={{
              width: cardSize,
              height: cardSize,
              backgroundColor: card4.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{card4.back}</Text>
          </View>
        </FlipCard>
      </View>
    );
  }
}
