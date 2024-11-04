/*
 ** EPITECH PROJECT, 2024
 ** stupidArea
 ** File description:
 ** DropdownModal
 */

import React from "react";
import {
    Modal,
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Text, Button } from "react-native-paper";
interface DropdownModalProps {
    visible: boolean;
    items: { label: string; value: string }[];
    onSelect: (item: { label: string; value: string }) => void;
    onClose: () => void;
    title?: string;
}

const DropdownModal: React.FC<DropdownModalProps> = ({
    visible,
    items,
    onSelect,
    onClose,
    title = "Select an option",
}) => {
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title} variant="headlineMedium">{title}</Text>
                    <FlatList
                        data={items}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                                style={styles.item}
                            >
                                <Text variant="bodyLarge">{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.value}
                    />
                    <Button
                        mode="contained-tonal"
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        Close
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

// export default DropdownModal;

interface DropdownSelectorProps {
    title: string;
    items: Array<{ label: string; value: string }>;
    selectedItem: { label: string; value: string } | null;
    onSelect: (item: { label: string; value: string }) => void;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

// const DropdownSelector: React.FC<DropdownSelectorProps> = ({
//     title,
//     items,
//     selectedItem,
//     onSelect,
//     modalVisible,
//     setModalVisible,
// }) => (
//     <View>
//         <TouchableOpacity
//             onPress={() => setModalVisible(true)}
//             style={{
//                 padding: 12,
//                 backgroundColor: "#ddd",
//                 marginBottom: 10,
//                 marginTop: 10,
//             }}
//         >
//             <Text>{selectedItem ? selectedItem.label : title}</Text>
//         </TouchableOpacity>
//         <DropdownModal
//             visible={modalVisible}
//             items={items}
//             onSelect={onSelect}
//             onClose={() => setModalVisible(false)}
//             title={title}
//         />
//     </View>
// );
const DropdownSelector: React.FC<DropdownSelectorProps> = ({
    title,
    items,
    selectedItem,
    onSelect,
    modalVisible,
    setModalVisible,
}) => (
    <View style={styles.container}>
        <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.selectorButton}
        >
            <Text variant="bodyLarge" style={styles.selectorText}>
                {selectedItem ? selectedItem.label : title}
            </Text>
        </TouchableOpacity>
        <DropdownModal
            visible={modalVisible}
            items={items}
            onSelect={onSelect}
            onClose={() => setModalVisible(false)}
            title={title}
        />
    </View>
);

export default DropdownSelector;

const styles = StyleSheet.create({
    //DROPDOWN MODAL
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContainer: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        marginBottom: 12,
        fontWeight: "bold",
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderColor: "#ddd",
    },
    closeButton: {
        marginTop: 16,
        width: "100%",
    },
    // DROPDOWN SELECTOR

    container: {
        marginVertical: 10,
    },
    selectorButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#FFFBFE",//"#f5f5f5",
        borderRadius: 8,
        elevation: 1,
        shadowColor: "#6750A4",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    selectorText: {
        color: "#333",
    },
});
