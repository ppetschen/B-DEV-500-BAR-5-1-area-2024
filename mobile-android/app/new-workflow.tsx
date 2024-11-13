/*
 ** EPITECH PROJECT, 2024
 ** Area
 ** File description:
 ** workflow
 */

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, View, FlatList } from "react-native";
import { Appbar, SegmentedButtons, Button, Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { styled } from "nativewind";
import { WorkflowDetails } from "@components/workflowDetails";
import DropdownSelector from "@components/DropdownSelector";

const StyledView = styled(View);

interface Action {
  id: string;
  serviceName: string;
  eventType: string;
}

interface Reaction {
  id: string;
  serviceName: string;
  eventType: string;
  payload: {
    name: string;
    content: string;
  };
}

interface ThisAreaValues {
  name: string;
  description: string;
  actions: Action;
  reactions: Reaction;
}

const mockActionServiceOptions = [
  {
    id: "1",
    serviceName: "Google",
    eventTypeOptions: ["Sheet Created", "File Uploaded", "Calendar Event"],
  },
  {
    id: "2",
    serviceName: "GitHub",
    eventTypeOptions: ["Issue Created", "Pull Request Created", "Commit Added"],
  },
  {
    id: "3",
    serviceName: "Outlook",
    eventTypeOptions: ["Email Dispatched"],
  },
  {
    id: "4",
    serviceName: "Jira",
    eventTypeOptions: ["Issue Created", "Issue Updated", "Issue Deleted"],
  },
];

const mockReactionServiceOptions = [
  {
    id: "a",
    serviceName: "Discord",
    eventTypeOptions: ["Discord Webhook"],
    payload: {
      name: "Webhook URL",
      content: "Message content",
    },
  },
  {
    id: "b",
    serviceName: "Google",
    eventTypeOptions: ["Google Drive File"],
    payload: {
      name: "File Name",
      content: "File content",
    },
  },
];

export default function AreaEditor(id: string | null) {
  const navigation = useNavigation();
  const [step, setStep] = useState<"details" | "actions" | "reactions">(
    "details"
  );
  const [areaName, setAreaName] = useState<string>("");
  const [areaDescription, setAreaDescription] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedAction, setSelectedAction] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [appModalVisible, setAppModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedReactionService, setSelectedReactionService] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedReactionEvent, setSelectedReactionEvent] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [eventTypeModalVisible, setEventTypeModalVisible] = useState(false);
  const [reactionPayload, setReactionPayload] = useState<{
    name: string;
    content: string;
  }>({ name: "", content: "" });

  const [detailsSnackbarVisible, setDetailsSnackbarVisible] =
    useState<boolean>(false);

  const handleSubmit = () => {
    // All fields must be filled in
    if (
      !areaName ||
      !areaDescription ||
      !selectedApp ||
      !selectedAction ||
      !selectedReactionService ||
      !selectedReactionEvent ||
      !reactionPayload.name ||
      !reactionPayload.content
    ) {
      setDetailsSnackbarVisible(true);
      return;
    }
    console.log({
      areaName,
      areaDescription,
      selectedApp,
      selectedAction,
    });
    navigation.goBack(); // Navigate back after creation
    //TODO: ADD CONNECTION TO BACKEND
  };

  const renderStepContent = () => {
    if (step === "details") {
      return (
        <View>
          <WorkflowDetails
            labelSmallInput="Workflow name"
            labelBigInput="Description"
            name={areaName}
            setName={setAreaName}
            description={areaDescription}
            setDescription={setAreaDescription}
          />
        </View>
      );
    } else if (step === "actions") {
      const appItems = mockActionServiceOptions.map((action) => ({
        label: action.serviceName,
        value: action.id,
      }));

      const actionTypeItems =
        (selectedApp &&
          mockActionServiceOptions
            .find((app) => app.id === selectedApp.value)
            ?.eventTypeOptions.map((eventType) => ({
              label: eventType,
              value: eventType,
            }))) ||
        [];

      return (
        <View>
          <DropdownSelector
            title="Select App"
            items={appItems}
            selectedItem={selectedApp}
            onSelect={(item) => {
              setSelectedApp(item);
              setSelectedAction(null);
            }}
            modalVisible={appModalVisible}
            setModalVisible={setAppModalVisible}
          />

          {selectedApp && (
            <DropdownSelector
              title="Select Action"
              items={actionTypeItems}
              selectedItem={selectedAction}
              onSelect={setSelectedAction}
              modalVisible={actionModalVisible}
              setModalVisible={setActionModalVisible}
            />
          )}
        </View>
      );
    } else if (step === "reactions") {
      const reactionItems = mockReactionServiceOptions.map((reaction) => ({
        label: reaction.serviceName,
        value: reaction.id,
      }));

      const reactionTypeItems =
        (selectedReactionService &&
          mockReactionServiceOptions
            .find((service) => service.id === selectedReactionService.value)
            ?.eventTypeOptions.map((eventType) => ({
              label: eventType,
              value: eventType,
            }))) ||
        [];

      const selectedReactionPayload =
        selectedReactionService &&
        mockReactionServiceOptions.find(
          (service) => service.id === selectedReactionService.value
        )?.payload;

      return (
        <View>
          <DropdownSelector
            title="Select Reaction Service"
            items={reactionItems}
            selectedItem={selectedReactionService}
            onSelect={(item) => {
              setSelectedReactionService(item);
              setSelectedReactionEvent(null);
            }}
            modalVisible={reactionModalVisible}
            setModalVisible={setReactionModalVisible}
          />

          {selectedReactionService && (
            <DropdownSelector
              title="Select Reaction Event"
              items={reactionTypeItems}
              selectedItem={selectedReactionEvent}
              onSelect={setSelectedReactionEvent}
              modalVisible={eventTypeModalVisible}
              setModalVisible={setEventTypeModalVisible}
            />
          )}

          {selectedReactionEvent && selectedReactionPayload && (
            <View>
              <WorkflowDetails
                labelSmallInput={selectedReactionPayload.name}
                labelBigInput={selectedReactionPayload.content}
                name={reactionPayload.name}
                setName={(value) =>
                  setReactionPayload((prevState) => ({
                    ...prevState,
                    name: typeof value === "string" ? value : prevState.name,
                  }))
                }
                description={reactionPayload.content}
                setDescription={(text) =>
                  setReactionPayload({
                    ...reactionPayload,
                    content:
                      typeof text === "string" ? text : reactionPayload.content,
                  })
                }
              />
            </View>
          )}
        </View>
      );
    }
  };
  //TODO: ADD CLEAR BUTTON - to clear all the fields from the specific step
  return (
    <>
      <SafeAreaView>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Create Workflow" />
        </Appbar.Header>
        <FlatList
          data={[{ key: step }]}
          renderItem={() => (
            <StyledView className="flex-1 justify-start px-6 mt-6">
              <SegmentedButtons
                value={step}
                onValueChange={(v) =>
                  setStep(v as "details" | "actions" | "reactions")
                }
                buttons={[
                  { value: "details", label: "Details" },
                  { value: "actions", label: "Actions" },
                  { value: "reactions", label: "Reactions" },
                ]}
              />
              {renderStepContent()}
            </StyledView>
          )}
          ListFooterComponent={<View style={{ height: 150 }} />}
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.createButton}
          >
            Create Workflow
          </Button>
        </View>
        <Snackbar
          visible={detailsSnackbarVisible}
          onDismiss={() => setDetailsSnackbarVisible(false)}
          duration={3000}
        >
          Please Make sure to fill in all the details.
        </Snackbar>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createButton: {
    width: "100%",
    bottom: 0,
  },
});
