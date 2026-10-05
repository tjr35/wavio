import type { Href } from "expo-router";
import ChevronRight from "lucide-react-native/dist/esm/icons/chevron-right.mjs";
import { useTranslation } from "react-i18next";
import { Uniwind } from "uniwind";
import FadeOutScaleDown from "@/components/FadeOutScaleDown";
import SettingsScreenScaffold from "@/components/settings/SettingsScreenScaffold";
import { SettingsToggleRow } from "@/components/settings/SettingsRows";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useApp from "@/stores/app";
import useLidarr from "@/stores/lidarr";
import useSoulSync from "@/stores/soulsync";
import useTidarr from "@/stores/tidarr";
import { cn } from "@/utils/tailwind";

function DownloaderRow({
  title,
  description,
  href,
  isConnected,
}: {
  title: string;
  description: string;
  href: Href;
  isConnected: boolean;
}) {
  const { t } = useTranslation();
  const [gray200] = Uniwind.getCSSVariable(["--color-gray-200"]) as string[];

  return (
    <FadeOutScaleDown href={href}>
      <HStack className="items-center gap-x-4 py-4">
        <VStack className="gap-y-1 flex-1">
          <Heading className="text-white font-normal" size="md">
            {title}
          </Heading>
          <Text className="text-primary-100 text-sm">{description}</Text>
        </VStack>
        <Badge
          className={cn(
            "rounded-full normal-case py-1 px-3",
            isConnected ? "bg-emerald-100" : "bg-primary-100",
          )}
          size="lg"
          variant="solid"
          action={isConnected ? "success" : "muted"}
        >
          <BadgeText
            className={cn(
              "normal-case text-center",
              isConnected ? "text-emerald-700" : "text-primary-700",
            )}
          >
            {isConnected
              ? t("app.settings.downloaders.statuses.active")
              : t("app.settings.downloaders.statuses.inactive")}
          </BadgeText>
        </Badge>
        <Box className="w-5 items-center">
          <ChevronRight size={20} color={gray200} />
        </Box>
      </HStack>
    </FadeOutScaleDown>
  );
}

export default function DownloadersSection() {
  const { t } = useTranslation();
  const isLidarrConnected = useLidarr((store) => store.isConnected);
  const isSoulSyncConnected = useSoulSync((store) => store.isConnected);
  const isTidarrConnected = useTidarr((store) => store.isConnected);
  const showLidarrTab = useApp((store) => store.showLidarrTab);
  const setShowLidarrTab = useApp((store) => store.setShowLidarrTab);
  const showSoulSyncTab = useApp((store) => store.showSoulSyncTab);
  const setShowSoulSyncTab = useApp((store) => store.setShowSoulSyncTab);
  const showTidarrTab = useApp((store) => store.showTidarrTab);
  const setShowTidarrTab = useApp((store) => store.setShowTidarrTab);

  return (
    <SettingsScreenScaffold title={t("app.settings.menu.downloaders.title")}>
      <VStack className="gap-y-4">
        <Text className="text-primary-100 text-sm py-2">
          {t("app.settings.downloaders.description")}
        </Text>
        <DownloaderRow
          title={t("app.settings.downloaders.lidarr.title")}
          description={t("app.settings.downloaders.lidarr.description")}
          href="/downloaders/lidarr"
          isConnected={isLidarrConnected}
        />
        <SettingsToggleRow
          label={t("app.settings.downloaders.lidarr.navbarTabLabel")}
          description={t("app.settings.downloaders.lidarr.navbarTabDescription")}
          value={showLidarrTab}
          onToggle={setShowLidarrTab}
          disabled={!isLidarrConnected}
        />
        <Divider className="bg-primary-400" />
        <DownloaderRow
          title={t("app.settings.downloaders.soulsync.title")}
          description={t("app.settings.downloaders.soulsync.description")}
          href="/downloaders/soulsync"
          isConnected={isSoulSyncConnected}
        />
        <SettingsToggleRow
          label={t("app.settings.downloaders.soulsync.navbarTabLabel")}
          description={t("app.settings.downloaders.soulsync.navbarTabDescription")}
          value={showSoulSyncTab}
          onToggle={setShowSoulSyncTab}
          disabled={!isSoulSyncConnected}
        />
        <Divider className="bg-primary-400" />
        <DownloaderRow
          title={t("app.settings.downloaders.tidarr.title")}
          description={t("app.settings.downloaders.tidarr.description")}
          href="/downloaders/tidarr"
          isConnected={isTidarrConnected}
        />
        <SettingsToggleRow
          label={t("app.settings.downloaders.tidarr.navbarTabLabel")}
          description={t("app.settings.downloaders.tidarr.navbarTabDescription")}
          value={showTidarrTab}
          onToggle={setShowTidarrTab}
          disabled={!isTidarrConnected}
        />
      </VStack>
    </SettingsScreenScaffold>
  );
}
