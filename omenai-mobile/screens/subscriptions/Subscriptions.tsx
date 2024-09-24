import { SafeAreaView, ScrollView, StyleSheet, Text, View, Platform, StatusBar} from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import InActiveSubscription from './features/InActiveSubscription';
import { useAppStore } from 'store/app/appStore';
import ActiveSubscriptions from './features/ActiveSubscriptions';
import WithModal from 'components/modal/WithModal';
import ActiveSubLoader from './components/ActiveSubLoader';
import { useModalStore } from 'store/modal/modalStore';
import { retrieveSubscriptionData } from 'services/subscriptions/retrieveSubscriptionData';
import { useIsFocused } from '@react-navigation/native';

export default function Subscriptions() {
    const isFocused = useIsFocused();

    const { userSession } = useAppStore();
    const { updateModal } = useModalStore();

    const [loading, setLoading] = useState<boolean>(false);
    const [isSubActive, setIsSubActive] = useState(false);
    const [ subscriptionData, setSubscriptionData ] = useState<any>();
    

    useEffect(() => {
        async function handleFetchSubData(){
            setLoading(true);

            const res = await retrieveSubscriptionData(userSession.id);
            
            if(res?.isOk && res.data !== (null || undefined)){
                setIsSubActive(true)
                setSubscriptionData(res.data);
            }else{
                //something went wrong
                updateModal({message: 'something went wrong', modalType: 'error', showModal: true})
            }

            setLoading(false)
        }

        if(isFocused){
            handleFetchSubData()
        }
    }, [isFocused]);

    return (
        <WithModal>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <Text style={{fontSize: 20, textAlign: 'center'}}>Subscription & Billing</Text>
                </View>
            </SafeAreaView>
            {loading ?
                <View style={{padding: 20}}>
                    <ActiveSubLoader />
                </View>
                :
                <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                    {isSubActive ?
                        <ActiveSubscriptions
                            subscriptionData={subscriptionData}
                        />
                    :
                        <InActiveSubscription />
                    }
                </ScrollView>
            }
        </WithModal>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 20,
    },
    mainContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        flex: 1
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
})