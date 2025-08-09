import { useAuth } from "@/contexts/AuthContext";
import {
  InputWithIcon,
  TextAreWithIcon,
} from "@/views/app/settings/components/inputs";
import {
  TextIcon,
  HashIcon,
  AtSignIcon,
  UserIcon,
  ImageIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useUI } from "@/contexts/UIContext";
import clsx from "clsx";

export function SettingsAccountSection() {
  const { glassMode } = useUI();
  const { user, updateTemporalUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [description, setDescription] = useState(user?.description || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setUsername(user.username);
      setEmail(user.email);
      setDescription(user.description || "");
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user]);

  useEffect(() => {
    updateTemporalUser({
      first_name: firstName,
      last_name: lastName,
      // username: username,
      email: email,
      description: description,
      avatar_url: avatarUrl,
    });
  }, [firstName, lastName, username, email, description, avatarUrl]);

  return (
    <section
      className={clsx(
        "w-full h-full flex items-start justify-between gap-5 rounded-2xl p-7 py-8",
        glassMode ? "glass-card" : "bg-white dark:bg-black"
      )}
    >
      <div className="w-full h-full flex flex-col gap-5 rounded-xl flex-1">
        <div className="w-full flex flex-col gap-5 max-w-xl">
          <div className="w-full flex items-center gap-3">
            <UserIcon className="w-10 h-10 text-black/60 dark:text-white/60" />
            <div>
              <h1 className="max-w-lg text-xl font-semibold leading-loose text-gray-900 dark:text-neutral-100/80">
                Cuenta
              </h1>
              <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
                Configuraciones asociadas a tu cuenta
              </p>
            </div>
          </div>

          <div className="w-full flex items-center gap-5">
            <InputWithIcon
              Icon={TextIcon}
              setValue={setFirstName}
              value={firstName}
              placeholder="Bruce"
              label="Nombre"
              type="text"
            />
            <InputWithIcon
              Icon={TextIcon}
              setValue={setLastName}
              value={lastName}
              placeholder="Wayne"
              label="Apellido"
              type="text"
            />
          </div>

          <div className="w-full">
            <InputWithIcon
              Icon={HashIcon}
              setValue={setUsername}
              value={username}
              placeholder="@username"
              label="Nombre de usuario"
              type="text"
              disable
            />
          </div>

          <div className="w-full">
            <InputWithIcon
              Icon={ImageIcon}
              setValue={setAvatarUrl}
              value={avatarUrl}
              placeholder="https://examp...."
              label="URL de imagen de perfil"
              type="text"
            />
          </div>

          <div className="w-full">
            <InputWithIcon
              Icon={AtSignIcon}
              setValue={setEmail}
              value={email}
              placeholder="example@email.com"
              label="Correo electrónico"
              type="email"
              disable
            />
          </div>

          <div className="w-full">
            <TextAreWithIcon
              setValue={setDescription}
              placeholder="Escribe aquí tu descripción ..."
              label="Descripción"
              value={description}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[300px] rounded-xl overflow-hidden flex flex-col items-start">
        <div className="w-full h-full aspect-square max-w-[300px]">
          <Avatar className="w-full h-full flex items-center justify-center">
            <AvatarImage
              src={avatarUrl}
              alt="Laura"
              className="rounded-md object-cover"
            />
            <AvatarFallback className="text-5xl">LA</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full flex justify-end items-end flex-col mt-2">
          <p className="text-lg dark:text-white/80 font-bold">
            {firstName} {lastName}
          </p>
          <p className="text-md dark:text-white/40">{username}</p>
          <p className="text-md dark:text-white/40">{email}</p>
        </div>
        <div className="text-sm dark:text-neutral-100/70 text-justify mt-4">
          {description ||
            "Aun no has definido tu descripción, cuentanos sobre ti ..."}
        </div>
      </div>
    </section>
  );
}
