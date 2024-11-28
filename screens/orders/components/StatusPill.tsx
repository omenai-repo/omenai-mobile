import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { colors } from 'config/colors.config';

type StatusPillProps = {
    status: string,
    payment_status: string,
    tracking_status: string,
    order_accepted: string,
    delivery_confirmed: boolean,
    availability: boolean
}

export default function StatusPill({ status, payment_status, tracking_status, order_accepted, delivery_confirmed, availability}: StatusPillProps) {

  if(!availability){
    return (
      <View style={[styles.pill, {backgroundColor: '#00800015'}]}>
          <Feather name='x-circle' size={14}/><Text style={styles.text}>Artwork unavailable for purchase</Text>
      </View>
    );
  } ;

  if (
        status === "pending" &&
        order_accepted === "accepted" &&
        payment_status === "pending" &&
        tracking_status === "" &&
        !delivery_confirmed
    ) {
        return (
          <View style={[styles.pill, {backgroundColor: '#FFBF0040'}]}>
            <MaterialIcons name='info-outline' size={14}/><Text style={styles.text}>Awaiting payment</Text>
          </View>
        );
    };

    if (
        status === "pending" &&
        order_accepted === "accepted" &&
        payment_status === "completed" &&
        tracking_status === "" &&
        !delivery_confirmed
      ) {
        return (
            <View style={[styles.pill, {backgroundColor: '#00800020'}]}>
                <AntDesign name='checkcircleo' size={14}/><Text style={styles.text}>Payment completed</Text>
            </View>
        );
      };

      if (
        status === "pending" &&
        order_accepted === "accepted" &&
        payment_status === "completed" &&
        tracking_status !== "" &&
        !delivery_confirmed
      ) {
        return (
            <View style={[styles.pill, {backgroundColor: '#00800015'}]}>
                <AntDesign name='checkcircleo' size={14}/><Text style={styles.text}>Delivery in progress</Text>
            </View>
        );
      };

      if (
        status === "pending" &&
        order_accepted === "" &&
        payment_status === "pending" &&
        tracking_status === "" &&
        !delivery_confirmed
      ) {
        return (
            <View style={[styles.pill, {backgroundColor: '#FFBF0040'}]}>
                <MaterialIcons name='info-outline' size={14}/><Text style={styles.text}>Order in review</Text>
            </View>
        );
      };

      if (
        status === "completed" &&
        order_accepted === "declined" &&
        !delivery_confirmed
      ) {
        return (
            <View style={[styles.pill, {backgroundColor: '#ff000020'}]}>
                <Feather name='x-circle' size={14}/><Text style={styles.text}>Order declined by Gallery</Text>
            </View>
        );
      }

      if (
        status === "completed" &&
        order_accepted === "accepted" &&
        delivery_confirmed
      ) {
        return (
            <View style={[styles.pill, {backgroundColor: '#00800015'}]}>
                <AntDesign name='checkcircleo' size={14}/><Text style={styles.text}>Order has been completed</Text>
            </View>
        );
      }

    return (
        <View style={[styles.pill, {backgroundColor: '#FFBF0040'}]}>
          <MaterialIcons name='info-outline' size={14}/><Text style={styles.text}>Awaiting gallery confirmation</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderRadius: 20
    },
    text: {
        fontSize: 12,
        color: colors.primary_black
    }
})