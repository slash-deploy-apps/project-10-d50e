'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    siteName: '파워프라자',
    siteDescription: '산업용 전원 변환 솔루션 전문 기업',
    contactEmail: 'ysp@powerplaza.co.kr',
    contactPhone: '02-855-4955',
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>
      <Card>
        <CardHeader>
          <CardTitle>사이트 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>사이트 이름</Label>
            <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>사이트 설명</Label>
            <Input value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>연락처 이메일</Label>
            <Input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>연락처 전화번호</Label>
            <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>
          <Button>저장</Button>
        </CardContent>
      </Card>
    </div>
  );
}