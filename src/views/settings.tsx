import { UserCard } from "@/components/common/user-profile";
import { SettingsEditorSection } from "./settings/settings-editor";
import { SettingsAccountSection } from "./settings/settings-account";
import { SettingsApplicationSection } from "./settings/settings-application";
import { SettingsActionsButton } from "./settings/settings-actions";
import { useAuth } from "@/contexts/AuthContext";

// https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Eduardo

export default function SettingsView() {
  const { user } = useAuth();

  return (
    <div className="w-full p-4 space-y-6">
      <div className="w-full flex justify-between">
        <div>
          <h1 className="max-w-lg text-3xl font-semibold leading-loose text-gray-900 dark:text-white">
            Configuraciones
          </h1>
          <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
            Configura tu software a gusto
          </p>
        </div>
        <div>
          <UserCard
            avatarUrl={user?.avatar_url}
            name={user?.first_name + " " + user?.last_name}
            email={user?.email}
          />
        </div>
      </div>

      <SettingsAccountSection />
      <SettingsApplicationSection />
      <SettingsEditorSection />
      <SettingsActionsButton />
    </div>
  );
}
