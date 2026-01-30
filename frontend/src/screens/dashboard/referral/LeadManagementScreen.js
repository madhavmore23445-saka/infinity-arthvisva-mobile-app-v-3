import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardService } from '../../../services/dashboardService';
import ReferralLeadModal from './ReferralLeadModal';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../../../constants/theme';

export default function LeadManagementScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('referral'); // 'referral' or 'detailed'
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const pageSizeOptions = [5, 10, 15, 20];

    const fetchLeads = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            if (activeTab === 'referral') {
                const response = await DashboardService.getLeads();
                if (response.success && Array.isArray(response.data)) {
                    setLeads(response.data);
                } else {
                    setLeads([]);
                }
            } else {
                setLeads([]);
            }
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab]);

    useFocusEffect(
        useCallback(() => {
            fetchLeads(true);
        }, [fetchLeads])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeads(false); // don't show the main spinner, use refresh indicator
    };

    const filteredLeads = leads.filter(lead => {
        const query = searchQuery.toLowerCase();
        return (
            (lead.lead_name && lead.lead_name.toLowerCase().includes(query)) ||
            (lead.ref_id && lead.ref_id.toLowerCase().includes(query)) ||
            (lead.contact_number && lead.contact_number.includes(query)) ||
            (lead.department && lead.department.toLowerCase().includes(query)) ||
            (lead.sub_category && lead.sub_category.toLowerCase().includes(query))
        );
    }).slice(0, pageSize);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const ListHeader = () => (
        <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.idCol]}>ID</Text>
            <Text style={[styles.headerCell, styles.refIdCol]}>Ref ID</Text>
            <Text style={[styles.headerCell, styles.clientCol]}>Client</Text>
            <Text style={[styles.headerCell, styles.contactCol]}>Contact</Text>
            <Text style={[styles.headerCell, styles.deptCol]}>Dept</Text>
            <Text style={[styles.headerCell, styles.productCol]}>Product</Text>
            <Text style={[styles.headerCell, styles.notesCol]}>Notes</Text>
            <Text style={[styles.headerCell, styles.dateCol]}>Created</Text>
        </View>
    );

    const renderLeadItem = ({ item, index }) => (
        <View style={[styles.row, index % 2 === 1 && { backgroundColor: theme.colors.rowAlternate }]}>
            <Text style={[styles.cell, styles.idCol]}>{item.id}</Text>
            <Text style={[styles.cell, styles.refIdCol, styles.boldText]}>{item.ref_id}</Text>
            <Text style={[styles.cell, styles.clientCol]} numberOfLines={1}>{item.lead_name}</Text>
            <Text style={[styles.cell, styles.contactCol]}>{item.contact_number}</Text>
            <Text style={[styles.cell, styles.deptCol]}>{item.department}</Text>
            <Text style={[styles.cell, styles.productCol]} numberOfLines={1}>{item.sub_category || '-'}</Text>
            <Text style={[styles.cell, styles.notesCol]} numberOfLines={1}>{item.notes || '-'}</Text>
            <Text style={[styles.cell, styles.dateCol]}>{formatDate(item.created_at)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                {/* Header Description Only */}
                <View style={styles.pageHeader}>
                    <Text style={styles.subtitle}>
                        Efficiently manage your sales pipeline from initial contact to conversion.
                    </Text>
                </View>

                {/* Top Buttons - Side by Side */}
                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.referralBtn]}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Ionicons name="person-add-outline" size={16} color={theme.colors.brandBlue} />
                        <Text style={styles.referralBtnText}>Referral Lead</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.detailedBtn]}
                        onPress={() => navigation.navigate('AddDetailedLead')}
                    >
                        <Ionicons name="add" size={18} color={theme.colors.white} />
                        <Text style={styles.detailedBtnText}>Add Detailed Lead</Text>
                    </TouchableOpacity>
                </View>

                {/* Summary Row / Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'referral' && styles.activeTabBorder]}
                        onPress={() => setActiveTab('referral')}
                    >
                        <Text style={[styles.tabText, activeTab === 'referral' && styles.activeTabText]}>
                            Referral Leads ({activeTab === 'referral' ? leads.length : '0'})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'detailed' && styles.activeTabBorder]}
                        onPress={() => setActiveTab('detailed')}
                    >
                        <Text style={[styles.tabText, activeTab === 'detailed' && styles.activeTabText]}>
                            Detailed Leads (0)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Combined Filter & Search Row */}
                <View style={styles.filterSearchRow}>
                    <View style={styles.pageSizeWrapper}>
                        {pageSizeOptions.map(size => (
                            <TouchableOpacity
                                key={size}
                                style={[styles.pageSizeOption, pageSize === size && styles.activePageSize]}
                                onPress={() => setPageSize(size)}
                            >
                                <Text style={[styles.pageSizeText, pageSize === size && styles.activePageSizeText]}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={16} color={theme.colors.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Ref ID, Client..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Scrollable Table Content */}
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={theme.colors.brandBlue} style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.tableWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <FlatList
                                data={filteredLeads}
                                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                                ListHeaderComponent={ListHeader}
                                stickyHeaderIndices={[0]}
                                renderItem={renderLeadItem}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={[theme.colors.brandBlue]}
                                        tintColor={theme.colors.brandBlue}
                                        progressViewOffset={5}
                                    />
                                }
                                ListEmptyComponent={() => (
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyText}>No leads found</Text>
                                    </View>
                                )}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                bounces={true}
                                overScrollMode="always"
                            />
                        </ScrollView>
                    </View>
                )}
            </View>

            <ReferralLeadModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSuccess={() => fetchLeads(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    mainContent: {
        flex: 1,
        padding: theme.spacing.md,
    },
    pageHeader: {
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: theme.borderRadius.sm,
    },
    referralBtn: {
        borderWidth: 1,
        borderColor: theme.colors.brandBlue,
        backgroundColor: theme.colors.white,
    },
    referralBtnText: {
        color: theme.colors.brandBlue,
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 13,
    },
    detailedBtn: {
        backgroundColor: theme.colors.brandBlue,
    },
    detailedBtnText: {
        color: theme.colors.white,
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 13,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 20,
    },
    tab: {
        paddingBottom: 8,
    },
    activeTabBorder: {
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.brandBlue,
    },
    tabText: {
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.textSecondary,
    },
    activeTabText: {
        color: theme.colors.brandBlue,
        fontWeight: '700',
    },
    filterSearchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    pageSizeWrapper: {
        flexDirection: 'row',
        gap: 4,
    },
    pageSizeOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.white,
    },
    activePageSize: {
        backgroundColor: theme.colors.brandBlue,
        borderColor: theme.colors.brandBlue,
    },
    pageSizeText: {
        fontSize: 10,
        color: theme.colors.text,
        fontWeight: '700',
    },
    activePageSizeText: {
        color: theme.colors.white,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: theme.colors.surface,
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        color: theme.colors.text,
        padding: 0,
    },
    tableWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.tableBorder,
        borderRadius: 8,
        backgroundColor: theme.colors.white,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.tableHeader,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.tableBorder,
    },
    headerCell: {
        ...theme.typography.label,
        fontSize: 11,
        color: theme.colors.textSecondary,
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.tableBorder,
        backgroundColor: theme.colors.white,
    },
    cell: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.text,
        paddingHorizontal: 10,
    },
    boldText: {
        fontWeight: '700',
        color: theme.colors.brandBlue,
    },
    // Column Widths
    idCol: { width: 50 },
    refIdCol: { width: 100 },
    clientCol: { width: 140 },
    contactCol: { width: 110 },
    deptCol: { width: 90 },
    productCol: { width: 130 },
    notesCol: { width: 180 },
    dateCol: { width: 110 },

    emptyState: {
        padding: 60,
        alignItems: 'center',
        width: 1000,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
});
