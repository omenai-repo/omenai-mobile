import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderTabs from './components/HeaderTabs';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';
import { organizeOrders } from 'utils/utils_splitArray';
import { galleryOrdersStore } from 'store/gallery/galleryOrdersStore';
import WithGalleryModal from 'components/modal/WithGalleryModal';
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore';
import PendingOrders from './components/PendingOrders';
import ProcessingOrders from './components/ProcessingOrders';
import CompletedOrders from './components/CompletedOrders';
import EmptyOrdersListing from './components/EmptyOrdersListing';
import OrderslistingLoader from './components/OrderslistingLoader';
import ScrollWrapper from 'components/general/ScrollWrapper';
import { getOrdersBySellerId } from 'services/orders/getOrdersBySellerId';
import WithModal from 'components/modal/WithModal';
import TabSwitcher from 'components/orders/TabSwitcher';
import tw from 'twrnc';
import DeclineOrderModal from 'screens/artist/orders/DeclineOrderModal';
import { useNavigation } from '@react-navigation/native';
import { useModalStore } from 'store/modal/modalStore';
import YearDropdown from 'screens/artist/orders/YearDropdown';
import { OrderContainer } from 'screens/artist/orders/OrderScreen';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import { utils_formatPrice } from 'utils/utils_priceFormatter';

export default function GalleryOrdersListing() {
  const { data, setData } = galleryOrdersStore();
  const { setIsVisible, setModalType, setCurrentId } = galleryOrderModalStore();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [openSection, setOpenSection] = useState<{ [key: number]: boolean }>({});
  const [declineModal, setDeclineModal] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { updateModal } = useModalStore();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    handleFetchOrders();
  }, [refreshing]);

  const handleFetchOrders = async () => {
    setIsloading(true);
    const results = await getOrdersBySellerId();
    let data = results?.data;
    const parsedOrders = organizeOrders(data);

    setData({
      pending: parsedOrders.pending,
      processing: parsedOrders.processing,
      completed: parsedOrders.completed,
    });

    setRefreshing(false);
    setIsloading(false);
  };

  const handleOpenModal = (modal: galleryOrderModalTypes, order_id: string) => {
    setIsVisible(true);
    setModalType(modal);
    setCurrentId(order_id);
  };

  const toggleRecentOrder = (key: number) => {
    setOpenSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getOrders = () => {
    if (selectedTab === 'pending') return data.pending;
    if (selectedTab === 'processing') return data.processing;
    return data.completed;
  };

  const currentOrders = getOrders();

  const galleryTabs = [
    { title: 'Pending', key: 'pending', count: data.pending.length },
    { title: 'Processing', key: 'processing', count: data.processing.length },
    { title: 'Completed', key: 'completed' },
  ];

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <Image
          style={tw.style(`w-[130px] h-[30px] mt-[80px] ml-[20px]`)}
          resizeMode="contain"
          source={require('../../assets/omenai-logo.png')}
        />

        <TabSwitcher
          tabs={galleryTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as 'pending' | 'processing' | 'completed')}
        />
        {/* <ScrollWrapper
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />
          }
        >
          <View
            style={{
              marginTop: 20,
              marginBottom: 150,
            }}
          >
            {selectedTab === 'pending' && !isloading && (
              <PendingOrders data={data[selectedTab]} handleOpenModal={handleOpenModal} />
            )}
            {selectedTab === 'processing' && !isloading && (
              <ProcessingOrders data={data[selectedTab]} handleOpenModal={handleOpenModal} />
            )}
            {selectedTab === 'completed' && !isloading && (
              <CompletedOrders data={data[selectedTab]} handleOpenModal={handleOpenModal} />
            )}
            {data[selectedTab].length === 0 && !isloading && (
              <EmptyOrdersListing status={selectedTab} />
            )}
            {isloading && <OrderslistingLoader />}
          </View>
        </ScrollWrapper> */}

        <View
          style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[140px]`}
        >
          {isloading ? (
            <OrderslistingLoader />
          ) : currentOrders.length === 0 ? (
            <EmptyOrdersListing status={selectedTab} />
          ) : (
            <>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-[16px] text-[#454545] font-semibold mb-[25px] flex-1`}>
                  Your Orders
                </Text>
                <YearDropdown selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
              </View>

              <FlatList
                data={currentOrders}
                keyExtractor={(item) => item.artwork_data._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-[30px]`}
                renderItem={({ item, index }) => (
                  <OrderContainer
                    id={index}
                    url={item.artwork_data.url}
                    open={openSection[item.artwork_data._id]}
                    setOpen={() => toggleRecentOrder(item.artwork_data._id)}
                    artId={item.order_id}
                    artName={item.artwork_data.title}
                    dateTime={formatIntlDateTime(item.createdAt)}
                    price={utils_formatPrice(item.artwork_data.pricing.usd_price)}
                    status={selectedTab}
                    lastId={index === currentOrders.length - 1}
                    acceptBtn={
                      selectedTab === 'pending'
                        ? () =>
                            navigation.navigate('DimentionsDetails', {
                              orderId: item.order_id,
                            })
                        : undefined
                    }
                    declineBtn={selectedTab === 'pending' ? () => setDeclineModal(true) : undefined}
                    delivered={item.shipping_details.delivery_confirmed}
                    order_accepted={item.order_accepted.status}
                    payment_status={item.payment_information.status}
                    tracking_status={item.shipping_details.shipment_information.tracking.id}
                    trackBtn={() =>
                      navigation.navigate('ShipmentTrackingScreen', { orderId: item.order_id })
                    }
                  />
                )}
              />
            </>
          )}
        </View>

        <DeclineOrderModal
          isModalVisible={declineModal}
          setIsModalVisible={setDeclineModal}
          confirmBtn={() => {}}
        />
      </View>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
