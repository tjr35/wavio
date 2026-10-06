import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, useSegments } from "expo-router";
import AudioWaveform from "lucide-react-native/dist/esm/icons/audio-waveform.mjs";
import Compass from "lucide-react-native/dist/esm/icons/compass.mjs";
import Home from "lucide-react-native/dist/esm/icons/house.mjs";
import Library from "lucide-react-native/dist/esm/icons/library.mjs";
import Music2 from "lucide-react-native/dist/esm/icons/music-2.mjs";
import Plus from "lucide-react-native/dist/esm/icons/plus.mjs";
import Search from "lucide-react-native/dist/esm/icons/search.mjs";
import type React from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import AddBottomSheet from "@/components/AddBottomSheet";
import {
  SIDEBAR_WIDTH,
  TAB_BAR_CONTENT_HEIGHT,
} from "@/components/FloatingPlayer";
import OfflineBanner, {
  OFFLINE_BANNER_HEIGHT,
} from "@/components/OfflineBanner";
import { useIsOnline } from "@/hooks/useIsOnline";
import useApp from "@/stores/app";
import useLidarr from "@/stores/lidarr";
import useSoulSync from "@/stores/soulsync";
import useTidarr from "@/stores/tidarr";

export default function TabLayout() {
  const { t } = useTranslation();
  const showAddTab = useApp((store) => store.showAddTab);
  const showLidarrTab = useApp((store) => store.showLidarrTab);
  const showSoulSyncTab = useApp((store) => store.showSoulSyncTab);
  const showTidarrTab = useApp((store) => store.showTidarrTab);
  const isLidarrConnected = useLidarr((store) => store.isConnected);
  const isSoulSyncConnected = useSoulSync((store) => store.isConnected);
  const isTidarrConnected = useTidarr((store) => store.isConnected);
  const addBottomSheetRef = useRef<BottomSheetModal>(null);
  const emerald = useCSSVariable("--color-emerald-500") as string | undefined;
  const gray = useCSSVariable("--color-gray-200") as string | undefined;
  const primary600 = useCSSVariable("--color-primary-600") as
    | string
    | undefined;
  const isOnline = useIsOnline();
  const isWideLayout = useApp((store) => store.isWideLayout);
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isOnSearchIndex = segments[segments.length - 1] === "(search)";

  const handleAddTabPress = () => {
    addBottomSheetRef.current?.present();
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            // Family + weight, like the font-bold utility in global.css: Inter Bold
            // when loaded, bold system font under zh-CN (see app/_layout.tsx).
            fontFamily: "Inter_700Bold",
            fontWeight: "700",
            fontSize: 10,
          },
          tabBarItemStyle: {
            paddingHorizontal: 0,
          },
          // In landscape, dock the tab bar to the left as a solid sidebar column;
          // react-navigation lays the screens out to its right automatically and
          // reports useBottomTabBarHeight() === 0.
          tabBarPosition: isWideLayout ? "left" : "bottom",
          // Pinned because react-navigation's default keys off its own
          // breakpoints (≥ 768dp or wider than tall), not ours: a portrait
          // tablet got a stacked sidebar, and a narrow landscape iPhone would get
          // a 32dp compact bar under a player placed for TAB_BAR_CONTENT_HEIGHT.
          tabBarLabelPosition: isWideLayout ? "beside-icon" : "below-icon",
          tabBarStyle: isWideLayout
            ? {
                position: "relative",
                // Pin all three: the sidebar applies its own `minWidth`
                // (getDefaultSidebarWidth) which would otherwise override `width`.
                width: SIDEBAR_WIDTH,
                minWidth: SIDEBAR_WIDTH,
                maxWidth: SIDEBAR_WIDTH,
                backgroundColor: primary600,
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
              }
            : {
                position: "absolute",
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                // While offline, grow the tab bar so the offline banner sits inside
                // the gradient just below the icons (icons stay put via paddingBottom).
                ...(isOnline
                  ? {}
                  : {
                      height:
                        TAB_BAR_CONTENT_HEIGHT +
                        insets.bottom +
                        OFFLINE_BANNER_HEIGHT,
                      paddingBottom: insets.bottom + OFFLINE_BANNER_HEIGHT,
                    }),
                // backgroundColor: "transparent",
              },
          tabBarButton: (props) => (
            <Pressable
              {...(props as React.ComponentProps<typeof Pressable>)}
              android_ripple={{ color: "transparent" }}
            />
          ),
          tabBarBackground: () =>
            isWideLayout ? (
              <View style={{ flex: 1, backgroundColor: primary600 }}>
                <OfflineBanner />
              </View>
            ) : (
              <LinearGradient
                colors={[
                  "rgba(0,0,0, 0)",
                  "rgba(0,0,0, 0.4)",
                  "rgba(0,0,0, 0.6)",
                  "rgba(0,0,0, 0.85)",
                  "rgb(0,0,0, 0.9)",
                ]}
                style={{ height: "100%" }}
                locations={[0, 0.1, 0.2, 0.5, 1]}
              >
                <OfflineBanner />
              </LinearGradient>
            ),
          tabBarActiveTintColor: emerald,
          tabBarInactiveTintColor: gray,
          // The sidebar (uikit, horizontal) draws a rounded accent pill behind
          // the active item; make it transparent so only the tint color marks it.
          tabBarActiveBackgroundColor: isWideLayout ? "transparent" : undefined,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: t("app.home.tabTitle"),
            tabBarIcon: ({ focused, color }) => (
              <Home color={color} size={24} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("(home)", { screen: "index" });
            },
          })}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            title: t("app.search.title"),
            tabBarIcon: ({ focused, color }) => (
              <Search color={color} size={24} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              // Tapping the tab while already sitting on the search index opens
              // the search field straight away (recent-searches autofocuses its
              // input); from anywhere deeper in the stack the tap returns to
              // the index first. `instant` skips the push animation so a double
              // tap doesn't linger on the index sliding out.
              if (isOnSearchIndex) {
                navigation.navigate("(search)", {
                  screen: "recent-searches",
                  params: { instant: "1" },
                });
                return;
              }
              navigation.navigate("(search)", { screen: "index" });
            },
          })}
        />
        <Tabs.Screen
          name="add"
          options={{
            // Only set `href` to hide the tab; when shown, omit it so the
            // custom `tabBarButton` (which suppresses the Android ripple)
            // applies instead of expo-router's href-injected Pressable.
            ...(showAddTab ? {} : { href: null as never }),
            title: t("app.create.title"),
            tabBarIcon: ({ color }) => <Plus size={24} color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleAddTabPress();
            },
          }}
        />
        <Tabs.Screen
          name="(library)"
          options={{
            title: t("app.library.title"),
            tabBarIcon: ({ focused, color }) => (
              <Library color={color} size={24} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("(library)", { screen: "index" });
            },
          })}
        />
        <Tabs.Screen
          name="lidarr-search"
          options={{
            ...(showLidarrTab && isLidarrConnected ? {} : { href: null as never }),
            title: t("app.lidarr.tabTitle"),
            tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("(search)", {
                screen: "downloaders/discovery",
              });
            },
          })}
        />
        <Tabs.Screen
          name="soulsync-search"
          options={{
            ...(showSoulSyncTab && isSoulSyncConnected ? {} : { href: null as never }),
            title: t("app.soulsync.tabTitle"),
            tabBarIcon: ({ color }) => <Music2 size={24} color={color} />,
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("(search)", {
                screen: "downloaders/soulsync/search",
              });
            },
          })}
        />
        <Tabs.Screen
          name="tidarr-search"
          options={{
            ...(showTidarrTab && isTidarrConnected ? {} : { href: null as never }),
            title: t("app.tidarr.tabTitle"),
            tabBarIcon: ({ color }) => <AudioWaveform size={24} color={color} />,
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("(search)", {
                screen: "downloaders/tidarr/search",
              });
            },
          })}
        />
      </Tabs>
      <AddBottomSheet ref={addBottomSheetRef} />
    </>
  );
}
