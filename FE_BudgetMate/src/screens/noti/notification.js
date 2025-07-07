import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import {
  getAllNoti,
  readNotiId,
  readAllNoti,
  deleteNoti,
} from "../../services/apiServices";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("all");
  const [items, setItems] = useState([
    { label: "All Notifications", value: "all" },
    { label: "Un-read Notifications", value: "unread" },
  ]);
  const unread = value === "unread";

  useEffect(() => {
    fetchUserNoti(unread);
  }, [unread]);

  const fetchUserNoti = async (unread) => {
    try {
      const res = await getAllNoti(unread);
      setNotifications(res.content);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await readNotiId(id);
      if (res) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, isRead: true, readAt: new Date() }
              : item
          )
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Read notifications failed!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await deleteNoti(id);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Delete notification success!",
        });
        fetchUserNoti(unread);
      } else {
        Toast.show({
          type: "error",
          text1: "Delete notification failed!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await readAllNoti();

      if (res) {
        fetchUserNoti(unread);
      } else {
        Toast.show({
          type: "error",
          text1: "Read all notifications failed!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[styles.notificationCard, item.isRead && styles.readNotification]}
    >
      <View style={styles.notificationRow}>
        <TouchableOpacity
          onPress={() => deleteNotification(item.id)}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={18} color="#dc2626" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => markAsRead(item.id)}
        >
          <View style={styles.row}>
            <Text style={[styles.title, item.isRead && styles.readTitle]}>
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>
            {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        containerStyle={{ marginBottom: 16, zIndex: 1000 }}
      />

      {notifications.length > 0 && (
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>You have no new notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1e3a8a",
  },
  notificationCard: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  readNotification: {
    backgroundColor: "#f1f5f9",
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  deleteButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    flex: 1,
    flexWrap: "wrap",
  },
  readTitle: {
    fontWeight: "normal",
    color: "#6b7280",
  },
  message: {
    color: "#374151",
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
    fontStyle: "italic",
  },
  markAllButton: {
    backgroundColor: "#1d4ed8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  markAllText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
