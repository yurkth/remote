using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Windows.Forms;
using System.Collections.Generic;

namespace MusicBeePlugin
{
    public partial class Plugin
    {
        private MusicBeeApiInterface mbApiInterface;
        private PluginInfo about = new PluginInfo();

        public PluginInfo Initialise(IntPtr apiInterfacePtr)
        {
            mbApiInterface = new MusicBeeApiInterface();
            mbApiInterface.Initialise(apiInterfacePtr);
            about.PluginInfoVersion = PluginInfoVersion;
            about.Name = "Now Playing";
            about.Description = "Sending the now playing in JSON format.";
            about.Author = "torin";
            about.TargetApplication = "";
            about.Type = PluginType.General;
            about.VersionMajor = 1;
            about.VersionMinor = 0;
            about.Revision = 0;
            about.MinInterfaceVersion = MinInterfaceVersion;
            about.MinApiRevision = MinApiRevision;
            about.ReceiveNotifications = (ReceiveNotificationFlags.PlayerEvents | ReceiveNotificationFlags.TagEvents);
            about.ConfigurationPanelHeight = 0;
            return about;
        }

        public void ReceiveNotification(string sourceFileUrl, NotificationType type)
        {
            switch (type)
            {
                case NotificationType.TrackChanged:
                    string title = mbApiInterface.NowPlaying_GetFileTag(MetaDataType.TrackTitle);
                    string album = mbApiInterface.NowPlaying_GetFileTag(MetaDataType.Album);
                    string comment = mbApiInterface.NowPlaying_GetFileTag(MetaDataType.Comment);
                    string artist = comment != "" ? comment : mbApiInterface.NowPlaying_GetFileTag(MetaDataType.Artist).Replace(";", ",");
                    string artwork = mbApiInterface.NowPlaying_GetArtwork() ?? "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="; // base64
                    string json = $"{{ \"title\": \"{ title }\", \"artist\": \"{ artist }\", \"album\": \"{ album }\", \"artwork\": \"{ artwork }\" }}";
                    sendRequest("http://localhost:55432/api/music", json);
                    break;
            }
        }
        
        private async void sendRequest(string url, string json)
        {
            using (var client = new HttpClient() { Timeout = TimeSpan.FromMilliseconds(10000) })
            {
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
                try
                {
                    var response = await client.SendAsync(request);
                }
                catch(Exception e)
                {
                    File.AppendAllText(@"Plugins/nowplaying.log", $"{DateTime.Now.ToString()}\n{e.ToString()}\n\n");
                }
            }

        }
   }
}