'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { authClient } from '@/lib/auth-client';

type ProfileViewProps = {
  user: { name: string; email: string };
};

const ProfileView = ({ user }: ProfileViewProps) => {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState('');
  const [isNameLoading, setIsNameLoading] = useState(false);

  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    await authClient.signOut();
    router.push('/');
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess(false);
    setIsNameLoading(true);

    const { error } = await authClient.updateUser({ name });

    if (error) {
      setNameError('Impossible de mettre à jour le prénom.');
    } else {
      setNameSuccess(true);
      router.refresh();
    }

    setIsNameLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    setIsPasswordLoading(true);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
    });

    if (error) {
      setPasswordError('Mot de passe actuel incorrect ou nouveau mot de passe invalide.');
    } else {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
    }

    setIsPasswordLoading(false);
  };

  return (
    <div className="mx-auto max-w-lg space-y-8 p-6">
      <h1 className="text-2xl font-semibold text-foreground">Mon profil</h1>

      {/* Informations */}
      <section className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-base font-medium text-foreground">Informations</h2>

        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Email</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Prénom
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameSuccess(false);
              }}
              required
              autoComplete="given-name"
            />
          </div>

          {nameError && (
            <p role="alert" className="text-sm text-destructive">
              {nameError}
            </p>
          )}
          {nameSuccess && (
            <p role="status" className="text-sm text-accent-foreground">
              Prénom mis à jour.
            </p>
          )}

          <Button type="submit" disabled={isNameLoading || name === user.name}>
            {isNameLoading ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </form>
      </section>

      {/* Mot de passe */}
      <section className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-base font-medium text-foreground">Mot de passe</h2>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
              Mot de passe actuel
            </label>
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
              Nouveau mot de passe
            </label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          {passwordError && (
            <p role="alert" className="text-sm text-destructive">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p role="status" className="text-sm text-accent-foreground">
              Mot de passe mis à jour.
            </p>
          )}

          <Button type="submit" disabled={isPasswordLoading}>
            {isPasswordLoading ? 'Mise à jour…' : 'Changer le mot de passe'}
          </Button>
        </form>
      </section>
      {/* Déconnexion */}
      <section className="rounded-xl border border-destructive/30 bg-card p-6 shadow-sm">
        <h2 className="text-base font-medium text-foreground mb-1">Se déconnecter</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Vous serez redirigé vers la page d&apos;accueil.
        </p>
        <Button
          variant="destructive"
          onClick={handleSignOut}
          disabled={isSignOutLoading}
        >
          {isSignOutLoading ? 'Déconnexion…' : 'Se déconnecter'}
        </Button>
      </section>
    </div>
  );
};

export { ProfileView };
