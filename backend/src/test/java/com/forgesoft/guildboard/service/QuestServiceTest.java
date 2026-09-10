package com.forgesoft.guildboard.service;

import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;
import com.forgesoft.guildboard.exception.BusinessRuleException;
import com.forgesoft.guildboard.mapper.AssignmentMapper;
import com.forgesoft.guildboard.mapper.QuestMapper;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.AssignmentRepository;
import com.forgesoft.guildboard.repository.QuestRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class QuestServiceTest {

    @Mock
    private QuestRepository questRepository;

    @Mock
    private AdventurerRepository adventurerRepository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private QuestMapper questMapper;

    @Mock
    private AssignmentMapper assignmentMapper;

    @InjectMocks
    private QuestService questService;

    @Test
    @DisplayName("assignQuest - Should assign the quest if all rules are respected")
    void assignQuest_ShouldAssign_WhenValid() {
        Quest quest = new Quest();
        quest.setStatus(QuestStatus.AVAILABLE);
        quest.setRequiredLevel(2);

        Adventurer adventurer = new Adventurer();
        adventurer.setLevel(5);

        given(questRepository.findById(1L)).willReturn(Optional.of(quest));
        given(adventurerRepository.findById(10L)).willReturn(Optional.of(adventurer));
        given(assignmentRepository.existsByAdventurerIdAndCompletedAtIsNull(10L)).willReturn(false);
        given(assignmentRepository.save(any(Assignment.class))).willReturn(new Assignment());
        given(assignmentMapper.toResponse(any())).willReturn(new AssignmentResponse(1L, 1L, "Quest title", Difficulty.EASY, 50, 150, LocalDateTime.now(), LocalDateTime.now()));

        AssignmentResponse response = questService.assignQuest(1L, 10L);

        assertThat(response).isNotNull();
        assertThat(quest.getStatus()).isEqualTo(QuestStatus.ON_GOING);
        verify(assignmentRepository).save(any(Assignment.class));
    }

    @Test
    @DisplayName("assignQuest - Should fail if level is too low")
    void assignQuest_ShouldThrow_WhenLevelTooLow() {
        Quest quest = new Quest();
        quest.setStatus(QuestStatus.AVAILABLE);
        quest.setRequiredLevel(10);

        Adventurer adventurer = new Adventurer();
        adventurer.setLevel(2);

        given(questRepository.findById(1L)).willReturn(Optional.of(quest));
        given(adventurerRepository.findById(10L)).willReturn(Optional.of(adventurer));

        assertThatThrownBy(() -> questService.assignQuest(1L, 10L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Insufficient adventurer level");
    }

    @Test
    @DisplayName("completeQuest - Should level up the adventurer (RG3)")
    void completeQuest_ShouldLevelUpAdventurer() {
        Quest quest = new Quest();
        quest.setStatus(QuestStatus.ON_GOING);
        quest.setGoldReward(50);
        quest.setXpReward(150);

        Adventurer adventurer = new Adventurer();
        adventurer.setLevel(1);
        adventurer.setXp(0);
        adventurer.setGold(0);

        Assignment assignment = new Assignment();
        assignment.setAdventurer(adventurer);

        given(questRepository.findById(1L)).willReturn(Optional.of(quest));
        given(assignmentRepository.findByQuestIdAndCompletedAtIsNull(1L)).willReturn(Optional.of(assignment));
        given(assignmentMapper.toResponse(assignment)).willReturn(new AssignmentResponse(1L, 1L, "Quest title", Difficulty.EASY, 50, 150, LocalDateTime.now(), LocalDateTime.now()));

        questService.completeQuest(1L);

        assertThat(adventurer.getLevel()).isEqualTo(2);
        assertThat(adventurer.getXp()).isEqualTo(50);
        assertThat(adventurer.getGold()).isEqualTo(50);
        assertThat(quest.getStatus()).isEqualTo(QuestStatus.COMPLETED);
    }
}