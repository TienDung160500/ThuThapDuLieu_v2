package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.LenhSanXuat;
import com.mycompany.myapp.repository.LenhSanXuatRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LenhSanXuatResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LenhSanXuatResourceIT {

    private static final Integer DEFAULT_MA_LENH_SAN_XUAT = 1;
    private static final Integer UPDATED_MA_LENH_SAN_XUAT = 2;

    private static final String DEFAULT_ENTRY_TIME = "AAAAAAAAAA";
    private static final String UPDATED_ENTRY_TIME = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lenh-san-xuats";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LenhSanXuatRepository lenhSanXuatRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLenhSanXuatMockMvc;

    private LenhSanXuat lenhSanXuat;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LenhSanXuat createEntity(EntityManager em) {
        LenhSanXuat lenhSanXuat = new LenhSanXuat()
            .maLenhSanXuat(DEFAULT_MA_LENH_SAN_XUAT)
            .entryTime(DEFAULT_ENTRY_TIME)
            .status(DEFAULT_STATUS)
            .comment(DEFAULT_COMMENT);
        return lenhSanXuat;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LenhSanXuat createUpdatedEntity(EntityManager em) {
        LenhSanXuat lenhSanXuat = new LenhSanXuat()
            .maLenhSanXuat(UPDATED_MA_LENH_SAN_XUAT)
            .entryTime(UPDATED_ENTRY_TIME)
            .status(UPDATED_STATUS)
            .comment(UPDATED_COMMENT);
        return lenhSanXuat;
    }

    @BeforeEach
    public void initTest() {
        lenhSanXuat = createEntity(em);
    }

    @Test
    @Transactional
    void createLenhSanXuat() throws Exception {
        int databaseSizeBeforeCreate = lenhSanXuatRepository.findAll().size();
        // Create the LenhSanXuat
        restLenhSanXuatMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isCreated());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeCreate + 1);
        LenhSanXuat testLenhSanXuat = lenhSanXuatList.get(lenhSanXuatList.size() - 1);
        assertThat(testLenhSanXuat.getMaLenhSanXuat()).isEqualTo(DEFAULT_MA_LENH_SAN_XUAT);
        assertThat(testLenhSanXuat.getEntryTime()).isEqualTo(DEFAULT_ENTRY_TIME);
        assertThat(testLenhSanXuat.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testLenhSanXuat.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createLenhSanXuatWithExistingId() throws Exception {
        // Create the LenhSanXuat with an existing ID
        lenhSanXuat.setId(1L);

        int databaseSizeBeforeCreate = lenhSanXuatRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLenhSanXuatMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isBadRequest());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMaLenhSanXuatIsRequired() throws Exception {
        int databaseSizeBeforeTest = lenhSanXuatRepository.findAll().size();
        // set the field null
        lenhSanXuat.setMaLenhSanXuat(null);

        // Create the LenhSanXuat, which fails.

        restLenhSanXuatMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isBadRequest());

        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLenhSanXuats() throws Exception {
        // Initialize the database
        lenhSanXuatRepository.saveAndFlush(lenhSanXuat);

        // Get all the lenhSanXuatList
        restLenhSanXuatMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lenhSanXuat.getId().intValue())))
            .andExpect(jsonPath("$.[*].maLenhSanXuat").value(hasItem(DEFAULT_MA_LENH_SAN_XUAT)))
            .andExpect(jsonPath("$.[*].entryTime").value(hasItem(DEFAULT_ENTRY_TIME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getLenhSanXuat() throws Exception {
        // Initialize the database
        lenhSanXuatRepository.saveAndFlush(lenhSanXuat);

        // Get the lenhSanXuat
        restLenhSanXuatMockMvc
            .perform(get(ENTITY_API_URL_ID, lenhSanXuat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lenhSanXuat.getId().intValue()))
            .andExpect(jsonPath("$.maLenhSanXuat").value(DEFAULT_MA_LENH_SAN_XUAT))
            .andExpect(jsonPath("$.entryTime").value(DEFAULT_ENTRY_TIME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingLenhSanXuat() throws Exception {
        // Get the lenhSanXuat
        restLenhSanXuatMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLenhSanXuat() throws Exception {
        // Initialize the database
        lenhSanXuatRepository.saveAndFlush(lenhSanXuat);

        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();

        // Update the lenhSanXuat
        LenhSanXuat updatedLenhSanXuat = lenhSanXuatRepository.findById(lenhSanXuat.getId()).get();
        // Disconnect from session so that the updates on updatedLenhSanXuat are not directly saved in db
        em.detach(updatedLenhSanXuat);
        updatedLenhSanXuat
            .maLenhSanXuat(UPDATED_MA_LENH_SAN_XUAT)
            .entryTime(UPDATED_ENTRY_TIME)
            .status(UPDATED_STATUS)
            .comment(UPDATED_COMMENT);

        restLenhSanXuatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLenhSanXuat.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLenhSanXuat))
            )
            .andExpect(status().isOk());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
        LenhSanXuat testLenhSanXuat = lenhSanXuatList.get(lenhSanXuatList.size() - 1);
        assertThat(testLenhSanXuat.getMaLenhSanXuat()).isEqualTo(UPDATED_MA_LENH_SAN_XUAT);
        assertThat(testLenhSanXuat.getEntryTime()).isEqualTo(UPDATED_ENTRY_TIME);
        assertThat(testLenhSanXuat.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testLenhSanXuat.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingLenhSanXuat() throws Exception {
        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();
        lenhSanXuat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLenhSanXuatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lenhSanXuat.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isBadRequest());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLenhSanXuat() throws Exception {
        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();
        lenhSanXuat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLenhSanXuatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isBadRequest());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLenhSanXuat() throws Exception {
        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();
        lenhSanXuat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLenhSanXuatMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLenhSanXuatWithPatch() throws Exception {
        // Initialize the database
        lenhSanXuatRepository.saveAndFlush(lenhSanXuat);

        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();

        // Update the lenhSanXuat using partial update
        LenhSanXuat partialUpdatedLenhSanXuat = new LenhSanXuat();
        partialUpdatedLenhSanXuat.setId(lenhSanXuat.getId());

        partialUpdatedLenhSanXuat.maLenhSanXuat(UPDATED_MA_LENH_SAN_XUAT);

        restLenhSanXuatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLenhSanXuat.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLenhSanXuat))
            )
            .andExpect(status().isOk());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
        LenhSanXuat testLenhSanXuat = lenhSanXuatList.get(lenhSanXuatList.size() - 1);
        assertThat(testLenhSanXuat.getMaLenhSanXuat()).isEqualTo(UPDATED_MA_LENH_SAN_XUAT);
        assertThat(testLenhSanXuat.getEntryTime()).isEqualTo(DEFAULT_ENTRY_TIME);
        assertThat(testLenhSanXuat.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testLenhSanXuat.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateLenhSanXuatWithPatch() throws Exception {
        // Initialize the database
        lenhSanXuatRepository.saveAndFlush(lenhSanXuat);

        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();

        // Update the lenhSanXuat using partial update
        LenhSanXuat partialUpdatedLenhSanXuat = new LenhSanXuat();
        partialUpdatedLenhSanXuat.setId(lenhSanXuat.getId());

        partialUpdatedLenhSanXuat
            .maLenhSanXuat(UPDATED_MA_LENH_SAN_XUAT)
            .entryTime(UPDATED_ENTRY_TIME)
            .status(UPDATED_STATUS)
            .comment(UPDATED_COMMENT);

        restLenhSanXuatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLenhSanXuat.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLenhSanXuat))
            )
            .andExpect(status().isOk());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
        LenhSanXuat testLenhSanXuat = lenhSanXuatList.get(lenhSanXuatList.size() - 1);
        assertThat(testLenhSanXuat.getMaLenhSanXuat()).isEqualTo(UPDATED_MA_LENH_SAN_XUAT);
        assertThat(testLenhSanXuat.getEntryTime()).isEqualTo(UPDATED_ENTRY_TIME);
        assertThat(testLenhSanXuat.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testLenhSanXuat.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingLenhSanXuat() throws Exception {
        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();
        lenhSanXuat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLenhSanXuatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lenhSanXuat.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isBadRequest());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLenhSanXuat() throws Exception {
        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();
        lenhSanXuat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLenhSanXuatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isBadRequest());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLenhSanXuat() throws Exception {
        int databaseSizeBeforeUpdate = lenhSanXuatRepository.findAll().size();
        lenhSanXuat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLenhSanXuatMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lenhSanXuat))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LenhSanXuat in the database
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLenhSanXuat() throws Exception {
        // Initialize the database
        lenhSanXuatRepository.saveAndFlush(lenhSanXuat);

        int databaseSizeBeforeDelete = lenhSanXuatRepository.findAll().size();

        // Delete the lenhSanXuat
        restLenhSanXuatMockMvc
            .perform(delete(ENTITY_API_URL_ID, lenhSanXuat.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LenhSanXuat> lenhSanXuatList = lenhSanXuatRepository.findAll();
        assertThat(lenhSanXuatList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
