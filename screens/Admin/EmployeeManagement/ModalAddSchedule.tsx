import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { addEmployeeSchedule } from "./api";

interface ModalAddScheduleProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (date: string, shift: number, note: string) => void;
  employeeUsername: string;
}

const ModalAddSchedule: React.FC<ModalAddScheduleProps> = ({
  isVisible,
  onClose,
  onSave,
  employeeUsername,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "dd-MM-yyyy")
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedShift, setSelectedShift] = useState<number>(1);
  const [note, setNote] = useState<string>("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(format(date, "dd-MM-yyyy"));
    hideDatePicker();
  };

  const handleSave = async () => {
    const scheduleData = {
      employee_username: employeeUsername,
      date: selectedDate,
      shift: selectedShift,
      note: note,
    };

    try {
      const response = await addEmployeeSchedule(scheduleData);
      console.log("Schedule added successfully:", response);
      onSave(selectedDate, selectedShift, note);
      onClose();
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Thêm lịch làm việc</Text>

          {/* Chọn ngày - nút chọn ngày */}
          <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {selectedDate ? `Ngày làm việc: ${selectedDate}` : "Chọn ngày làm việc"}
            </Text>
          </TouchableOpacity>

          {/* Chọn ca */}
          <Text style={styles.inputLabel}>Chọn ca làm việc:</Text>
          <View style={styles.shiftContainer}>
            <TouchableOpacity
              style={[
                styles.shiftButton,
                selectedShift === 1 && { backgroundColor: "#218838" },
              ]}
              onPress={() => setSelectedShift(1)}
            >
              <Text style={styles.shiftButtonText}>Ca 1: 8h00 - 12h00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.shiftButton,
                selectedShift === 2 && { backgroundColor: "#218838" },
              ]}
              onPress={() => setSelectedShift(2)}
            >
              <Text style={styles.shiftButtonText}>Ca 2: 12h00 - 16h00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.shiftButton,
                selectedShift === 3 && { backgroundColor: "#218838" },
              ]}
              onPress={() => setSelectedShift(3)}
            >
              <Text style={styles.shiftButtonText}>Ca 3: 16h00 - 22h00</Text>
            </TouchableOpacity>
          </View>

          {/* Ghi chú */}
          <TextInput
            style={styles.textInput}
            placeholder="Nhập ghi chú"
            value={note}
            onChangeText={setNote}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={new Date(selectedDate.split("-").reverse().join("-"))}
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  shiftContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  shiftButton: {
    padding: 12,
    backgroundColor: "#28a745",
    borderRadius: 8,
    marginVertical: 5,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#218838",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  shiftButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    width: '100%',
    textAlign: 'center'
  },
});

export default ModalAddSchedule;
