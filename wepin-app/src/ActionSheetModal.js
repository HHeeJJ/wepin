import React, {useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';

function ActionSheetModal(props) {
  const {isVisible, closeModel, itemList, type} = props;

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '100%',
      backgroundColor: 'white',
      padding: 16,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    modalText: {
      fontSize: 18,
      marginBottom: 10,
      color: '#000000',
    },
    cancelText: {
      fontSize: 18,
      marginBottom: 10,
      color: '#FF3B30',
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => closeModel(type, -1, 'default')}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {itemList.map((item, idx) => {
            if (item === '신고하기') {
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => closeModel(type, idx, item)}>
                  <Text style={styles.cancelText}>{item}</Text>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => closeModel(type, idx, item)}>
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

export default ActionSheetModal;
