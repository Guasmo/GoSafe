import { useAuthContext } from '@/hooks/useAuthContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';

interface ProfileOptionProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress: () => void;
    showArrow?: boolean;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, label, value, onPress, showArrow = true }) => (
    <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 border-b border-border"
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-lg bg-primary/10 justify-center items-center mr-4">
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <Text className="text-base text-textPrimary flex-1">{label}</Text>
        </View>
        <View className="flex-row items-center gap-2">
            {value && <Text className="text-sm text-textSecondary">{value}</Text>}
            {showArrow && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
        </View>
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { logout } = useAuthContext()
    const { user, loading: userLoading, getUser } = useUser()

    const handleLogout = async () => {
        setLogoutLoading(true);
        await logout();
        setLogoutLoading(false);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await getUser();
        setRefreshing(false);
    };

    const skeletonConfig = {
        boneColor: "#374151",
        highlightColor: "#4B5563",
    };

    const SkeletonProfileOption = () => (
        <View className="flex-row items-center justify-between py-4 px-4 border-b border-border">
            <View className="flex-row items-center flex-1">
                <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 36, height: 36, borderRadius: 8, marginRight: 16 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: skeletonConfig.boneColor }} />
                </Skeleton>
                <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 150, height: 16, borderRadius: 4 }}>
                    <View style={{ width: 150, height: 16, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                </Skeleton>
            </View>
            <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 20, height: 20, borderRadius: 10 }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: skeletonConfig.boneColor }} />
            </Skeleton>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* Header */}
                <View className="px-6 py-4">
                    <Text className="text-2xl font-bold text-textPrimary">Perfil</Text>
                </View>

                {/* Profile Card */}
                <View className="bg-backgroundCard mx-6 mb-6 rounded-2xl p-8 items-center shadow-sm shadow-black/10 elevation-3">
                    <View className="relative mb-4">
                        {userLoading ? (
                            <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 100, height: 100, borderRadius: 50 }}>
                                <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: skeletonConfig.boneColor }} />
                            </Skeleton>
                        ) : (
                            <View className="w-[100px] h-[100px] rounded-full bg-white justify-center items-center border-[3px] border-primary">
                                {user?.imageUrl ? (
                                    <Image
                                        source={{ uri: user.imageUrl }}
                                        style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                    />
                                ) : (
                                    <Ionicons name="person-circle" size={24} color="#3B82F6" />
                                )}
                            </View>
                        )}
                        {!userLoading && (
                            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary justify-center items-center border-[3px] border-backgroundCard">
                                <Ionicons name="camera" size={16} color={colors.textPrimary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {userLoading ? (
                        <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 150, height: 24, marginBottom: 8, borderRadius: 4 }}>
                            <View style={{ width: 150, height: 24, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                        </Skeleton>
                    ) : (
                        <Text className="text-2xl font-bold text-textPrimary text-center mb-1">{user?.userName}</Text>
                    )}

                    {userLoading ? (
                        <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 200, height: 16, marginBottom: 24, borderRadius: 4 }}>
                            <View style={{ width: 200, height: 16, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                        </Skeleton>
                    ) : (
                        <Text className="text-base text-textSecondary text-center mb-6">{user?.email}</Text>
                    )}

                    <View className="flex-row items-center justify-around w-full pt-6 border-t border-border">
                        <View className="items-center flex-1">
                            {userLoading ? (
                                <View className="items-center">
                                    <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 40, height: 32, marginBottom: 4, borderRadius: 4 }}>
                                        <View style={{ width: 40, height: 32, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                                    </Skeleton>
                                    <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 40, height: 14, borderRadius: 4 }}>
                                        <View style={{ width: 40, height: 14, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                                    </Skeleton>
                                </View>
                            ) : (
                                <>
                                    <Text className="text-2xl font-bold text-primary mb-1">24</Text>
                                    <Text className="text-sm text-textSecondary">Rutas</Text>
                                </>
                            )}
                        </View>
                        <View className="w-[1px] h-10 bg-border" />
                        <View className="items-center flex-1">
                            {userLoading ? (
                                <View className="items-center">
                                    <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 50, height: 32, marginBottom: 4, borderRadius: 4 }}>
                                        <View style={{ width: 50, height: 32, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                                    </Skeleton>
                                    <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 30, height: 14, borderRadius: 4 }}>
                                        <View style={{ width: 30, height: 14, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                                    </Skeleton>
                                </View>
                            ) : (
                                <>
                                    <Text className="text-2xl font-bold text-primary mb-1">156</Text>
                                    <Text className="text-sm text-textSecondary">km</Text>
                                </>
                            )}
                        </View>
                        <View className="w-[1px] h-10 bg-border" />
                        <View className="items-center flex-1">
                            {userLoading ? (
                                <View className="items-center">
                                    <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 30, height: 32, marginBottom: 4, borderRadius: 4 }}>
                                        <View style={{ width: 30, height: 32, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                                    </Skeleton>
                                    <Skeleton {...skeletonConfig} isLoading={true} containerStyle={{ width: 50, height: 14, borderRadius: 4 }}>
                                        <View style={{ width: 50, height: 14, borderRadius: 4, backgroundColor: skeletonConfig.boneColor }} />
                                    </Skeleton>
                                </View>
                            ) : (
                                <>
                                    <Text className="text-2xl font-bold text-primary mb-1">12</Text>
                                    <Text className="text-sm text-textSecondary">Alertas</Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                {/* Account Section */}
                <View className="mb-6">
                    <Text className="text-base font-semibold text-textSecondary px-6 mb-2 uppercase tracking-wide">Cuenta</Text>
                    <View className="bg-backgroundCard mx-6 rounded-xl overflow-hidden">
                        {userLoading ? (
                            <>
                                <SkeletonProfileOption />
                                <SkeletonProfileOption />
                                <SkeletonProfileOption />
                                <SkeletonProfileOption />
                            </>
                        ) : (
                            <>
                                <ProfileOption
                                    icon="person-outline"
                                    label="Información personal"
                                    onPress={() => { }}
                                />
                                <ProfileOption
                                    icon="shield-checkmark-outline"
                                    label="Seguridad"
                                    onPress={() => { }}
                                />
                                <ProfileOption
                                    icon="notifications-outline"
                                    label="Notificaciones"
                                    value="Activadas"
                                    onPress={() => { }}
                                />
                                <ProfileOption
                                    icon="location-outline"
                                    label="Ubicación"
                                    value="Siempre"
                                    onPress={() => { }}
                                />
                            </>
                        )}
                    </View>
                </View>

                {/* Preferences Section */}
                <View className="mb-6">
                    <Text className="text-base font-semibold text-textSecondary px-6 mb-2 uppercase tracking-wide">Preferencias</Text>
                    <View className="bg-backgroundCard mx-6 rounded-xl overflow-hidden">
                        {userLoading ? (
                            <>
                                <SkeletonProfileOption />
                                <SkeletonProfileOption />
                            </>
                        ) : (
                            <>
                                <ProfileOption
                                    icon="moon-outline"
                                    label="Tema oscuro"
                                    value="Desactivado"
                                    onPress={() => { }}
                                />
                                <ProfileOption
                                    icon="language-outline"
                                    label="Idioma"
                                    value="Español"
                                    onPress={() => { }}
                                />
                            </>
                        )}
                    </View>
                </View>

                {/* Support Section */}
                <View className="mb-6">
                    <Text className="text-base font-semibold text-textSecondary px-6 mb-2 uppercase tracking-wide">Soporte</Text>
                    <View className="bg-backgroundCard mx-6 rounded-xl overflow-hidden">
                        {userLoading ? (
                            <>
                                <SkeletonProfileOption />
                                <SkeletonProfileOption />
                                <SkeletonProfileOption />
                                <SkeletonProfileOption />
                            </>
                        ) : (
                            <>
                                <ProfileOption
                                    icon="help-circle-outline"
                                    label="Centro de ayuda"
                                    onPress={() => { }}
                                />
                                <ProfileOption
                                    icon="chatbubble-outline"
                                    label="Contactar soporte"
                                    onPress={() => { }}
                                />
                                <ProfileOption
                                    icon="star-outline"
                                    label="Calificar app"
                                    onPress={() => { }}
                                />
                                <ProfileOption
                                    icon="information-circle-outline"
                                    label="Acerca de"
                                    value="v1.0.0"
                                    onPress={() => { }}
                                />
                            </>
                        )}
                    </View>
                </View>

                {/* Logout Button */}
                <View className="px-6 mt-4 mb-6">
                    <Button
                        title="Cerrar Sesión"
                        onPress={handleLogout}
                        variant="secondary"
                        loading={logoutLoading}
                    />
                </View>

                {/* Footer */}
                <View className="items-center py-8">
                    <Text className="text-sm text-textSecondary mb-2">GoSafe © 2024</Text>
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity>
                            <Text className="text-sm text-primary">Términos</Text>
                        </TouchableOpacity>
                        <Text className="text-sm text-textSecondary">•</Text>
                        <TouchableOpacity>
                            <Text className="text-sm text-primary">Privacidad</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
