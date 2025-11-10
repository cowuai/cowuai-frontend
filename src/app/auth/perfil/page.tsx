"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Mail, Phone, MapPin, Calendar, User, Save } from "lucide-react";
import { toast } from "sonner";
import BreadcrumbArea from "@/components/custom/BreadcrumbArea";
import {useAuth} from "@/app/providers/AuthProvider";
import {Spinner} from "@/components/ui/spinner";
import {getProfile} from "@/actions/getProfile";
import {putUsuario} from "@/actions/putUsuario";

export type ProfileData = {
        totalAnimals: number,
        totalFarms: number
}

const Profile = () => {
    const { usuario, accessToken } = useAuth();
    const DEFAULT_AVATAR = "https://github.githubassets.com/assets/quickdraw-default--light-medium-5450fadcbe37.png";
    const [avatarUrl, setAvatarUrl] = useState(usuario?.urlImagem || DEFAULT_AVATAR);
    const [tempAvatarUrl, setTempAvatarUrl] = useState("");
    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
    const [userData, setUserData] = useState(usuario);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);

    // Atualiza o avatar quando a URL da imagem do usuário muda
    React.useEffect(() => {
      setAvatarUrl(usuario?.urlImagem || DEFAULT_AVATAR);
    }, [usuario?.urlImagem]);

    // Busca os dados do perfil ao carregar o componente
    React.useEffect(() => {
        if (!accessToken) return;
        (async () => {
            try {
                const data = await getProfile(accessToken);
                setProfileData(data);
            } catch (e) { console.error(e); }
        })();
    }, [accessToken]);

    const handleAvatarSave = async () => {
        if (tempAvatarUrl) {
            setAvatarUrl(tempAvatarUrl);
            setIsAvatarDialogOpen(false);

            try {
                const updatedUser = await putUsuario(accessToken!, { ...userData!, urlImagem: tempAvatarUrl });
                setUserData(updatedUser);
            } catch (error) {
                console.error("Erro ao salvar avatar do usuário:", error);
            }

            toast.success("Avatar atualizado com sucesso!");
            setTempAvatarUrl("");
        }
    };

    const handleSaveProfile = async () => {
        if (!userData || !accessToken) return;
        try {
            const updatedUser = await putUsuario(accessToken, userData);
            setUserData(updatedUser);
        } catch (error) {
            console.error("Erro ao salvar perfil do usuário:", error);
        }
        toast.success("Perfil atualizado com sucesso!");
    };

    if (!userData || !profileData) {
        return <div className="min-h-screen flex items-center justify-center"><Spinner/></div>;
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header com o breadcrumb */}
                <h1 className="text-4xl font-bold text-primary mb-8 font-tsukimi-rounded">Perfil do Usuário</h1>
                <BreadcrumbArea />

                {/* Card do Perfil no Header */}
                <Card className="shadow-lg border-none bg-secondary">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                                    <AvatarImage src={avatarUrl} alt={userData.nome} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                                        {userData.nome.split(' ').filter(Boolean).map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg bg-primary hover:bg-primary/90"
                                        >
                                            <Camera className="h-5 w-5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>

                                        <DialogHeader>
                                            <DialogTitle className={"font-tsukimi-rounded text-primary"}>Alterar Avatar</DialogTitle>
                                            <DialogDescription>
                                                Digite a URL da imagem ou faça upload de uma nova imagem para o seu avatar.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <Tabs defaultValue="url" className="w-full">
                                            <TabsList
                                                className="grid w-full grid-cols-2 rounded-md bg-muted text-muted-foreground"
                                                style={{ borderBottom: "none" }}
                                            >
                                                <TabsTrigger
                                                    value="url"
                                                    className="rounded-md text-sm font-medium data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground"
                                                >
                                                    URL
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="upload"
                                                    className="rounded-md text-sm font-medium data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground"
                                                >
                                                    Upload
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="url" className="space-y-4 ">
                                                <div className="space-y-2">
                                                    <Label>URL da Imagem</Label>
                                                    <Input
                                                        className={"bg-white"}
                                                        placeholder="https://exemplo.com/avatar.jpg"
                                                        value={tempAvatarUrl}
                                                        onChange={(e) => setTempAvatarUrl(e.target.value)}
                                                    />
                                                </div>
                                                {tempAvatarUrl && (
                                                    <div className="flex justify-center">
                                                        <Avatar className="h-24 w-24">
                                                            <AvatarImage src={tempAvatarUrl} alt="Preview" />
                                                            <AvatarFallback>Preview</AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                )}
                                                <Button onClick={handleAvatarSave} className="w-full">
                                                    Salvar Avatar
                                                </Button>
                                            </TabsContent>
                                            <TabsContent value="upload" className="space-y-4">
                                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Arraste uma imagem ou clique para selecionar
                                                    </p>
                                                    <Input type="file" accept="image/*" className="cursor-pointer bg-secondary" />
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-3xl font-bold text-foreground font-tsukimi-rounded">{userData.nome}</h2>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground mt-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {userData.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {userData.telefone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {userData.localizacao}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Membro desde {new Date(userData.dataCadastro).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cards de Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-primary text-primary-foreground shadow-lg border-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Animais Gerenciados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{profileData?.totalAnimals}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-secondary text-secondary-foreground shadow-lg border-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Fazendas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{profileData?.totalFarms}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Formulário de informações do perfil */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informações do Perfil
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        value={userData.nome}
                                        onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input
                                        id="phone"
                                        value={userData.telefone}
                                        onChange={(e) => setUserData({ ...userData, telefone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Localização</Label>
                                    <Input
                                        id="location"
                                        value={userData.localizacao}
                                        onChange={(e) => setUserData({ ...userData, localizacao: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveProfile} type="button" className="w-full md:w-auto">
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alterações
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
