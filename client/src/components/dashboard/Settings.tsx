import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Shield, Smartphone } from "lucide-react";

export default function Settings() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeInUp">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
                <p className="text-slate-400">Manage your profile and preferences.</p>
            </div>

            {/* Profile Card */}
            <Card className="glass-card border-none bg-white/5">
                <CardHeader>
                    <CardTitle className="text-xl">Profile Information</CardTitle>
                    <CardDescription className="text-slate-400">Update your account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-20 h-20 border-2 border-[#818CF8]/30">
                            <AvatarImage src={user?.photoURL || ""} />
                            <AvatarFallback className="bg-slate-800 text-[#818CF8] text-2xl">
                                {user?.displayName?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" className="border-white/10 hover:bg-white/5">Change Avatar</Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><User className="w-4 h-4 text-[#818CF8]" /> Display Name</Label>
                            <Input defaultValue={user?.displayName || ""} className="bg-black/20 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#818CF8]" /> Email</Label>
                            <Input defaultValue={user?.email || ""} disabled className="bg-black/20 border-white/10 opacity-50" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button className="bg-[#818CF8] text-black hover:bg-[#6FD2C0] font-bold">Save Changes</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="glass-card border-none bg-white/5">
                <CardHeader>
                    <CardTitle className="text-xl">Security & Privacy</CardTitle>
                    <CardDescription className="text-slate-400">Manage your password and sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-black/20">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#818CF8]/10 rounded-lg">
                                <Shield className="w-6 h-6 text-[#818CF8]" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Password</h4>
                                <p className="text-sm text-slate-400">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/10">Update</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-black/20">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#818CF8]/10 rounded-lg">
                                <Smartphone className="w-6 h-6 text-[#818CF8]" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Two-Factor Authentication</h4>
                                <p className="text-sm text-slate-400">Add an extra layer of security</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/10">Enable</Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
