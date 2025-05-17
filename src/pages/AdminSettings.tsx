
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const settingsSchema = z.object({
  announcement_email: z.string().email({ message: "Please enter a valid email address" }),
  tournament_registration_link: z.string().url({ message: "Please enter a valid URL" }),
  tournament_registration_enabled: z.boolean()
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const AdminSettings = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is superadmin
  useEffect(() => {
    if (profile && profile.role !== 'superadmin') {
      toast.error("Only super administrators can access settings");
      navigate('/admin');
    }
  }, [profile, navigate]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      announcement_email: '',
      tournament_registration_link: '',
      tournament_registration_enabled: false
    }
  });

  // Load current settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('setting_key, setting_value');

        if (error) throw error;

        const settingsMap = data?.reduce((acc: Record<string, string>, item) => {
          acc[item.setting_key] = item.setting_value || '';
          return acc;
        }, {});

        if (settingsMap) {
          form.reset({
            announcement_email: settingsMap.announcement_email || '',
            tournament_registration_link: settingsMap.tournament_registration_link || '',
            tournament_registration_enabled: settingsMap.tournament_registration_enabled === 'true'
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsLoading(true);
    
    try {
      // Update each setting individually
      const updates = [
        { setting_key: 'announcement_email', setting_value: values.announcement_email },
        { setting_key: 'tournament_registration_link', setting_value: values.tournament_registration_link },
        { setting_key: 'tournament_registration_enabled', setting_value: values.tournament_registration_enabled.toString() }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .update({ setting_value: update.setting_value, updated_at: new Date().toISOString() })
          .eq('setting_key', update.setting_key);

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile || profile.role !== 'superadmin') {
    return null; // Don't render anything while checking permissions
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-serif mb-6">System Administration</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="email">Email Announcements</TabsTrigger>
          <TabsTrigger value="registration">Tournament Registration</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General System Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide settings that affect the entire application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Additional general settings will appear here in future updates.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Email Announcement Settings</CardTitle>
                  <CardDescription>
                    Configure email settings for tournament announcements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="announcement_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Announcement Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="announcements@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          This email will be used as the sender for all tournament announcements
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Send Test Email</h3>
                    <div className="flex items-center gap-4">
                      <Input type="email" placeholder="Recipient email" className="max-w-md" />
                      <Button type="button" variant="outline">
                        Send Test
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Send a test email to verify your announcement configuration
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="registration">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Registration</CardTitle>
                  <CardDescription>
                    Configure the tournament registration link shown on the homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tournament_registration_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://forms.example.com/register" {...field} />
                        </FormControl>
                        <FormDescription>
                          External link where players can register for the tournament
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tournament_registration_enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Registration</FormLabel>
                          <FormDescription>
                            Show the registration button on the homepage
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
