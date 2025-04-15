import {View, ActivityIndicator} from 'react-native';
import { Text } from 'react-native-paper';

export const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8ccfcb',
        fontFamily: 'Sansita-Regular'
      }}>
        <Text style={{fontSize: 70, paddingVertical: 40, fontFamily: 'Sansita-Bold'}}>
          TravelSage
        </Text>
        <Text style={{fontSize: 25, fontFamily: 'Sansita-Regular'}}>Explore.Plan.Experience</Text>
      <ActivityIndicator color={'#000'} animating={true} size="small" />
    </View>
  );
};

// .swatch_1{
//   background: #f0f1f1;
// }
// .swatch_2{
//   background: #e9a594;
// }
// .swatch_3{
//   background: #0d1314;
// }
// .swatch_4{
//   background: #1b5363;
// }
// .swatch_5{
//   background: #edc6ba;
// }
// .swatch_6{
//   background: #35b5ae;
// }
// .swatch_7{
//   background: #90564d;
// }
// .swatch_8{
//   background: #8ccfcb;
// }