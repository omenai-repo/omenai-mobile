import {
  StyleSheet,
  Text,
  SafeAreaView,
  RefreshControl,
  View,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import WithModal from "components/modal/WithModal";
import Header from "components/header/Header";
import SalesOverview from "./components/SalesOverview";
import RecentOrders from "./components/RecentOrders";
import { HighlightCard } from "./components/HighlightCard";
import PopularArtworks from "./components/PopularArtworks";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import ScrollWrapper from "components/general/ScrollWrapper";
const CopilotText = walkthroughable(Text);

export default function Overview() {
  const { start } = useCopilot();

  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handlePress = async () => {
    start();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handlePress();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    setRefreshCount((prev) => prev + 1);
  }, []);

  const CustomComponent = ({
    copilot,
    children,
  }: {
    copilot: any;
    children: React.ReactNode;
  }) => (
    <View {...copilot} style={{ flex: 1 }}>
      {children}
    </View>
  );

  return (
    <WithModal>
      
        <ScrollWrapper
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SafeAreaView style={styles.safeArea}>
            <Header />
          </SafeAreaView>
          <View style={styles.container}>
            <Text style={{ fontSize: 16, fontWeight: "400" }}>Overview</Text>
            <View style={styles.contentsContainer}>
              <CopilotStep
                text="View total number of artworks here"
                order={1}
                name="total-artworks"
              >
                <CustomComponent>
                  <HighlightCard
                    refreshCount={refreshCount}
                    name="Total artworks"
                    type="artworks"
                  />
                </CustomComponent>
              </CopilotStep>
              <CopilotStep
                text="View total number of sold artworks here"
                order={2}
                name="total-sold-artworks"
              >
                <CustomComponent>
                  <HighlightCard
                    refreshCount={refreshCount}
                    name="Sold artworks"
                    type="sales"
                  />
                </CustomComponent>
              </CopilotStep>
            </View>
          </View>
          <CopilotStep
            text="You can view your sales progress from this chart here, it keeps track of and shows how much revenue you've made from successful artwork sales."
            order={3}
            name="sales-overview"
          >
            <CustomComponent>
              <SalesOverview refreshCount={refreshCount} />
            </CustomComponent>
          </CopilotStep>
          <PopularArtworks refreshCount={refreshCount} />
          <RecentOrders refreshCount={refreshCount} />
        </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  contentsContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
