"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Eye, EyeOff } from "lucide-react"
import { Card } from "./Card"

export function SettingsView({ orgData, userName, userEmail, onSaved, onOrgUpdated }: {
  orgData: any; userName: string; userEmail?: string | null;
  onSaved: (msg: string, type?: "success" | "error") => void;
  onOrgUpdated: () => void;
}) {
  const [campName, setCampName] = useState("")
  const [location, setLocation] = useState("")
  const [timezone, setTimezone] = useState("")
  const [savingOrg, setSavingOrg] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (orgData) {
      setCampName(orgData.name || "")
      setLocation(orgData.location || "")
      setTimezone(orgData.timezone || "Africa/Nairobi")
    }
  }, [orgData])

  async function handleSaveOrg(e: React.FormEvent) {
    e.preventDefault()
    if (!orgData?.id) return
    setSavingOrg(true)
    try {
      const res = await fetch("/api/org/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: orgData.id, name: campName, location, timezone }),
      })
      if (!res.ok) throw new Error("Failed to save")
      onSaved("Camp settings saved")
      onOrgUpdated()
    } catch {
      onSaved("Failed to save settings", "error")
    } finally {
      setSavingOrg(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      onSaved("Passwords do not match", "error")
      return
    }
    if (newPassword.length < 8) {
      onSaved("Password must be at least 8 characters", "error")
      return
    }
    setSavingPassword(true)
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || "Failed to change password")
      }
      onSaved("Password changed")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (err: any) {
      console.error(err)
      onSaved("Failed to change password", "error")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <h3 className="text-lg font-display italic mb-6">Camp Profile</h3>
        <form onSubmit={handleSaveOrg} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-white/40">Camp Name</label>
            <input
              type="text"
              value={campName}
              onChange={e => setCampName(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none placeholder:text-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/40">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none placeholder:text-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/40">Timezone</label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none"
            >
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam (EAT)</option>
              <option value="Africa/Kampala">Africa/Kampala (EAT)</option>
              <option value="Africa/Addis_Ababa">Africa/Addis Ababa (EAT)</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
              <option value="Africa/Cairo">Africa/Cairo (EET)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={savingOrg}
            className="flex items-center gap-2 bg-[#E67E22]/10 text-[#E67E22] px-5 py-2.5 rounded-full text-sm font-medium ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all disabled:opacity-50"
          >
            {savingOrg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save changes
          </button>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-display italic mb-6">Profile</h3>
        <div className="space-y-4">
          <div className="py-3 border-b border-white/5">
            <p className="text-xs text-white/40 mb-1">Name</p>
            <p className="text-sm">{userName}</p>
          </div>
          <div className="py-3">
            <p className="text-xs text-white/40 mb-1">Email</p>
            <p className="text-sm">{userEmail || '\u2014'}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-display italic mb-6">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-white/40">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 pr-10 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/40">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none placeholder:text-white/20"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/40">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none placeholder:text-white/20"
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 bg-[#E67E22]/10 text-[#E67E22] px-5 py-2.5 rounded-full text-sm font-medium ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all disabled:opacity-50"
          >
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Update password
          </button>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-display italic mb-4">Organization</h3>
        <div className="space-y-3">
          <div className="py-3 border-b border-white/5">
            <p className="text-xs text-white/40 mb-1">Organization ID</p>
            <p className="text-sm font-mono text-white/30 text-xs">{orgData?.id || '\u2014'}</p>
          </div>
          <div className="py-3">
            <p className="text-xs text-white/40 mb-1">Camp Since</p>
            <p className="text-sm">
              {orgData?.created_at
                ? new Date(orgData.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : '\u2014'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
